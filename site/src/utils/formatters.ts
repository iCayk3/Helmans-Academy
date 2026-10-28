/**
 * Utilitários de Formatação e Sanitização - Helmans Academy
 */

/**
 * Sanitiza texto removendo tags HTML e caracteres maliciosos
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Aplica máscara de telefone celular brasileiro (XX) XXXXX-XXXX
 */
export function maskPhone(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length <= 2) return clean;
  if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
}

/**
 * Valida se é um telefone celular brasileiro válido com DDD (10 ou 11 dígitos)
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  if (clean.length !== 11 && clean.length !== 10) return false;
  const ddd = parseInt(clean.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  return true;
}

/**
 * Gera URL oficial para o WhatsApp com texto pré-definido
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Verifica se a academia está aberta neste momento com base no horário local
 */
export function getGymOpenStatus(): { isOpen: boolean; message: string; closingOrOpeningText: string } {
  const now = new Date();
  const day = now.getDay(); // 0: Dom, 1: Seg, ..., 6: Sab
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // Seg a Sex: 05:00 às 23:00 (300 min às 1380 min)
  if (day >= 1 && day <= 5) {
    const openTime = 5 * 60;
    const closeTime = 23 * 60;
    if (currentTime >= openTime && currentTime < closeTime) {
      return {
        isOpen: true,
        message: 'Aberto agora',
        closingOrOpeningText: 'Fecha hoje às 23:00',
      };
    } else {
      return {
        isOpen: false,
        message: 'Fechado no momento',
        closingOrOpeningText: currentTime < openTime ? 'Abre hoje às 05:00' : 'Abre amanhã às 05:00',
      };
    }
  }

  // Sábado: 08:00 às 18:00 (480 min às 1080 min)
  if (day === 6) {
    const openTime = 8 * 60;
    const closeTime = 18 * 60;
    if (currentTime >= openTime && currentTime < closeTime) {
      return {
        isOpen: true,
        message: 'Aberto agora',
        closingOrOpeningText: 'Fecha hoje às 18:00',
      };
    } else {
      return {
        isOpen: false,
        message: 'Fechado no momento',
        closingOrOpeningText: currentTime < openTime ? 'Abre hoje às 08:00' : 'Abre amanhã às 08:00',
      };
    }
  }

  // Domingo / Feriado: 08:00 às 14:00 (480 min às 840 min)
  const openTime = 8 * 60;
  const closeTime = 14 * 60;
  if (currentTime >= openTime && currentTime < closeTime) {
    return {
      isOpen: true,
      message: 'Aberto agora',
      closingOrOpeningText: 'Fecha hoje às 14:00',
    };
  } else {
    return {
      isOpen: false,
      message: 'Fechado no momento',
      closingOrOpeningText: currentTime < openTime ? 'Abre hoje às 08:00' : 'Abre amanhã às 05:00',
    };
  }
}
