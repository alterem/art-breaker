/**
 * FLUX.1-Kontext API Integration
 * 真实的图像生成API服务
 */

export interface FluxKontextConfig {
  baseUrl?: string;
  timeout?: number;
}

export interface EditImageRequest {
  inputImage: string;  // 输入图像URL
  prompt: string;      // 创意指令
  model?: string;      // 模型名称
  enableTranslation?: boolean;
  outputFormat?: string;
}

export interface FileUploadResponse {
  success: boolean;
  code: number;
  msg: string;
  data: {
    fileId: string;
    fileName: string;
    originalName: string;
    fileSize: number;
    mimeType: string;
    uploadPath: string;
    fileUrl: string;
    downloadUrl: string;
    uploadTime: string;
    expiresAt: string;
  };
}

export interface TaskResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  error?: string;
  progress?: number;
}

export class FluxKontextAPI {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: FluxKontextConfig = {}) {
    this.apiKey = '1b250d94ea1120a5c8c956730b09a49a'; // 内嵌API密钥
    this.baseUrl = config.baseUrl || 'https://api.kie.ai/api/v1/flux/kontext';
    this.timeout = config.timeout || 300000; // 5 minutes
  }

  /**
   * 上传图像文件到服务器
   */
  async uploadImage(file: File): Promise<string> {
    const uploadUrl = 'https://kieai.redpandaai.co/api/file-stream-upload';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadPath', 'images/user-uploads');
    formData.append('fileName', `${Date.now()}-${file.name}`);

    // console.log('Uploading image:', file.name, 'Size:', file.size);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msg: '上传失败' }));
      console.error('Upload Error Response:', response.status, errorData);
      throw new Error(errorData.msg || `上传失败: HTTP ${response.status}`);
    }

    const result: any = await response.json();
    // console.log('Upload Response:', result);
    
    if (!result.success || result.code !== 200) {
      throw new Error(`上传失败: ${result.msg || 'Unknown error'}`);
    }
    
    // 根据实际API响应结构提取文件URL
    // 实际响应中文件URL在 data.downloadUrl 字段
    const fileUrl = result.data?.downloadUrl || result.data?.fileUrl || result.data?.url || result.fileUrl || result.url;
    
    if (!fileUrl) {
      console.error('API响应结构:', JSON.stringify(result, null, 2));
      throw new Error('上传成功但未找到文件URL，请检查API响应格式');
    }

    // console.log('提取到的文件URL:', fileUrl);
    return fileUrl;
  }

  /**
   * 提交图像编辑任务
   */
  async editImage(request: EditImageRequest): Promise<string> {
    const payload = {
      inputImage: request.inputImage,
      prompt: request.prompt,
      model: request.model || 'flux-kontext-pro',
      enableTranslation: request.enableTranslation !== false,
      outputFormat: request.outputFormat || 'jpeg'
    };

    const generateUrl = `${this.baseUrl}/generate`;
    // console.log('API Generate URL:', generateUrl);
    // console.log('API Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '请求失败' }));
      console.error('API Error Response:', response.status, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    // console.log('API Generate Response:', result);
    
    // 正确解析API响应结构
    if (result.code !== 200) {
      throw new Error(`Generation failed: ${result.msg || 'Unknown error'}`);
    }
    
    // 检查data字段和taskId
    if (!result.data || !result.data.taskId) {
      throw new Error('Invalid API response: missing taskId in data field');
    }

    return result.data.taskId;
  }

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string): Promise<TaskResponse> {
    const statusUrl = `${this.baseUrl}/record-info?taskId=${taskId}`;
    // console.log('API Status URL:', statusUrl);

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '查询失败' }));
      console.error('API Status Error:', response.status, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    // console.log('API Status Response:', result);
    
    // 正确解析API响应结构
    if (result.code !== 200) {
      throw new Error(`Status query failed: ${result.msg || 'Unknown error'}`);
    }
    
    // 返回data字段中的状态信息
    if (!result.data) {
      throw new Error('Invalid API response: missing data field');
    }

    return result.data;
  }

  /**
   * 轮询等待任务完成
   */
  async waitForCompletion(
    taskId: string, 
    onProgress?: (status: TaskResponse) => void
  ): Promise<TaskResponse> {
    const startTime = Date.now();
    const pollInterval = 3000; // 3秒轮询一次
    // console.log('Starting task polling for taskId:', taskId);

    while (Date.now() - startTime < this.timeout) {
      try {
        const statusData = await this.getTaskStatus(taskId);
        // console.log('Polling status data:', statusData);
        
        // 构建标准的TaskResponse对象
        const status: TaskResponse = {
          taskId: (statusData as any).taskId || taskId,
          status: this.mapApiStatusBySuccessFlag((statusData as any).successFlag),
          imageUrl: (statusData as any).response?.resultImageUrl,
          error: (statusData as any).errorMessage || (statusData as any).msg,
          progress: (statusData as any).progress
        };
        
        // console.log('Mapped status:', status);
        
        // 回调进度更新
        if (onProgress) {
          onProgress(status);
        }

        // 检查任务是否完成
        if (status.status === 'completed') {
          if (!status.imageUrl) {
            console.error('Task completed but no image URL found:', statusData);
            throw new Error('任务完成但未返回图像URL');
          }
          // console.log('Task completed successfully:', status.imageUrl);
          return status;
        }
        
        if (status.status === 'failed') {
          console.error('Task failed:', statusData);
          const failureMessage = status.error || '生成失败，请尝试调整您的提示词后重试。可能是提示词内容不合适或过于复杂。';
          throw new Error(failureMessage);
        }

        // console.log(`Task still ${status.status}, continuing to poll...`);
        // 等待下次轮询
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Polling error:', error);
        // 如果是网络错误，继续重试
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // console.log('Network error, retrying...');
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }
        throw error;
      }
    }

    throw new Error('生成超时，请稍后重试');
  }

  /**
   * 根据successFlag映射API状态到标准状态
   */
  private mapApiStatusBySuccessFlag(successFlag: any): 'pending' | 'processing' | 'completed' | 'failed' {
    // console.log('Mapping API successFlag:', successFlag);
    
    // successFlag = 1 表示成功完成，0 表示还在处理中，3 表示请求失败
    if (successFlag === 1) {
      return 'completed';
    } else if (successFlag === 0) {
      return 'processing';
    } else if (successFlag === 3) {
      return 'failed';
    } else {
      // 其他情况视为处理中
      return 'pending';
    }
  }

  /**
   * 完整的图像生成流程
   */
  async generateImage(
    request: EditImageRequest,
    onProgress?: (status: TaskResponse) => void
  ): Promise<string> {
    // 1. 提交任务
    const taskId = await this.editImage(request);
    
    // 2. 等待完成
    const result = await this.waitForCompletion(taskId, onProgress);
    
    return result.imageUrl!;
  }
}

/**
 * API密钥管理（已禁用，使用内嵌密钥）
 */
export class ApiKeyManager {
  private static readonly STORAGE_KEY = 'flux_kontext_api_key';

  static getApiKey(): string | null {
    return '1b250d94ea1120a5c8c956730b09a49a'; // 返回内嵌密钥
  }

  static setApiKey(apiKey: string): void {
    // 不再存储，始终使用内嵌密钥
  }

  static clearApiKey(): void {
    // 不再清除，始终使用内嵌密钥
  }

  static hasApiKey(): boolean {
    return true; // 始终返回true，因为有内嵌密钥
  }
}
