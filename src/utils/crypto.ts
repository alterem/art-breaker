/**
 * 简单的字符串加解密工具
 * 使用 XOR 加密算法
 */

class SimpleCrypto {
  private static readonly SECRET_KEY = 'artbreaker_secret_2024';

  /**
   * 加密字符串
   */
  static encrypt(text: string): string {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
      encrypted += String.fromCharCode(charCode ^ keyCode);
    }
    return btoa(encrypted); // Base64 编码
  }

  /**
   * 解密字符串
   */
  static decrypt(encryptedText: string): string {
    try {
      const encrypted = atob(encryptedText); // Base64 解码
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i);
        const keyCode = this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
        decrypted += String.fromCharCode(charCode ^ keyCode);
      }
      return decrypted;
    } catch (error) {
      throw new Error('解密失败');
    }
  }
}

export { SimpleCrypto };
