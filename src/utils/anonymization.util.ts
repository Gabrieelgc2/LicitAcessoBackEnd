/**
 * Utilitário de Anonimização e Mascaramento de Dados Sensíveis
 * Alinhado com as especificações da documentação do LicitAcesso (Grupo 8).
 */

export class AnonymizationUtil {
  /**
   * Mascara um endereço de e-mail.
   * Exemplo: gabrielgc@email.com -> gab****@email.com
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart.substring(0, 1)}****@${domain}`;
    }
    return `${localPart.substring(0, 3)}****@${domain}`;
  }

  /**
   * Mascara um CPF.
   * Exemplo: 123.456.789-00 -> 123.***.***-00
   * Aceita tanto CPF formatado quanto apenas números.
   */
  static maskCpf(cpf: string): string {
    if (!cpf) return cpf;
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      // Se não for um CPF de 11 dígitos, mascara parcialmente com base no tamanho
      return cpf.substring(0, 3) + '***' + cpf.substring(cpf.length - 2);
    }
    const part1 = cleanCpf.substring(0, 3);
    const part4 = cleanCpf.substring(9, 11);
    return `${part1}.***.***-${part4}`;
  }

  /**
   * Mascara um número de telefone.
   * Exemplo: (81) 98765-4321 -> (81) 9****-4321
   * Exemplo 2: 81987654321 -> 819****4321
   */
  static maskPhone(phone: string): string {
    if (!phone) return phone;
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se tiver DDD e 9 dígitos (ex: 81987654321)
    if (cleanPhone.length === 11) {
      const ddd = cleanPhone.substring(0, 2);
      const digit = cleanPhone.substring(2, 3);
      const lastFour = cleanPhone.substring(7, 11);
      return `(${ddd}) ${digit}****-${lastFour}`;
    }
    
    // Se tiver DDD e 8 dígitos (ex: 8187654321)
    if (cleanPhone.length === 10) {
      const ddd = cleanPhone.substring(0, 2);
      const lastFour = cleanPhone.substring(6, 10);
      return `(${ddd}) ****-${lastFour}`;
    }

    // Fallback genérico caso não corresponda a padrões conhecidos
    if (phone.length > 4) {
      return phone.substring(0, 2) + '****' + phone.substring(phone.length - 4);
    }
    return '****';
  }

  /**
   * Mascara número de cartão de crédito.
   * Exemplo: 1234 5678 1234 9981 -> **** **** **** 9981
   */
  static maskCard(card: string): string {
    if (!card) return card;
    const cleanCard = card.replace(/\D/g, '');
    if (cleanCard.length >= 4) {
      const lastFour = cleanCard.substring(cleanCard.length - 4);
      return `**** **** **** ${lastFour}`;
    }
    return '**** **** **** ****';
  }

  /**
   * Remove identificadores diretos de um objeto de usuário para relatórios/estatísticas.
   * Mantém apenas informações não identificáveis.
   */
  static anonymizeUser(user: { id?: string; name: string; email: string }) {
    return {
      id: user.id || 'anônimo',
      email: this.maskEmail(user.email),
      // Remove nome completo e outras informações diretas
    };
  }
}
