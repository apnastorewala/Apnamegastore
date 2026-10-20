import { CompletedOrder, StoreConfig } from '../types/grocery';

export function formatOrderForTelegramHtml(
  order: CompletedOrder,
  storeConfig: StoreConfig
): string {
  const itemsText = order.items
    .map((item, idx) => {
      const itemTotal = item.product.price * item.quantity;
      return `${idx + 1}. <b>${escapeHtml(item.product.name)}</b> (${escapeHtml(item.product.packSize)})\n   └ ₹${item.product.price} × ${item.quantity} = <b>₹${itemTotal}</b>`;
    })
    .join('\n');

  const paymentLabel =
    order.customer.paymentMethod === 'cod'
      ? '💵 Cash on Delivery (COD)'
      : order.customer.paymentMethod === 'upi_doorstep'
        ? '📱 UPI Scanner at Doorstep (GPay / PhonePe / Paytm)'
        : '💳 Online UPI Advance';

  return (
`🛒 <b>NEW MART HOME DELIVERY ORDER!</b>
━━━━━━━━━━━━━━━━━━━━━
<b>Order ID:</b> #${escapeHtml(order.orderId)}
<b>Date & Time:</b> ${escapeHtml(order.date)}
<b>Store:</b> ${escapeHtml(storeConfig.storeName)}

📦 <b>ORDERED ITEMS:</b>
${itemsText}

💰 <b>BILL SUMMARY:</b>
Subtotal: ₹${order.subtotal}
Delivery Charges: ${order.deliveryFee === 0 ? '<b>FREE</b> 🚀' : `₹${order.deliveryFee}`}
<b>Total Payable: ₹${order.totalPayable}</b>
${order.totalSavings > 0 ? `🎉 <i>Customer Saved: ₹${order.totalSavings}</i>\n` : ''}
━━━━━━━━━━━━━━━━━━━━━
👤 <b>CUSTOMER DETAILS:</b>
• <b>Name:</b> ${escapeHtml(order.customer.fullName)}
• <b>Mobile:</b> <code>+91 ${escapeHtml(order.customer.phone)}</code>
• <b>Address:</b> ${escapeHtml(order.customer.address)}
• <b>Landmark:</b> 📍 <b>${escapeHtml(order.customer.landmark)}</b>
• <b>Pin Code:</b> ${escapeHtml(order.customer.pincode)}
• <b>Preferred Slot:</b> ${escapeHtml(order.customer.deliverySlot)}
• <b>Payment Mode:</b> ${paymentLabel}
${order.customer.orderNotes ? `• <b>Notes:</b> <i>${escapeHtml(order.customer.orderNotes)}</i>\n` : ''}━━━━━━━━━━━━━━━━━━━━━
⚡ <i>Dispatch delivery boy with fresh packed items.</i>`
  );
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendOrderToTelegramBot(
  order: CompletedOrder,
  storeConfig: StoreConfig
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  const token = storeConfig.telegramBotToken?.trim();
  const chatId = storeConfig.telegramChatId?.trim();

  if (!token || !chatId) {
    return {
      success: false,
      error: 'Bot Token or Chat ID not configured. Please add them in src/config.ts',
    };
  }

  const cleanToken = token.startsWith('bot') ? token.slice(3) : token;
  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
  const messageHtml = formatOrderForTelegramHtml(order, storeConfig);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true, messageId: data.result?.message_id };
    } else {
      return {
        success: false,
        error: data.description || 'Failed to send message via Telegram Bot API',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error connecting to Telegram Bot API',
    };
  }
}