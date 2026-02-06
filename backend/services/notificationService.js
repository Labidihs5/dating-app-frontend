const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('./emailService');
const prisma = new PrismaClient();

const shouldNotifyInApp = (settings, type) => {
  if (!settings) return true;
  if (type === 'message') return settings.messageNotifications !== false;
  if (type === 'match' || type === 'like') return settings.matchNotifications !== false;
  return settings.pushNotifications !== false;
};

const isRecentlyOnline = (user) => {
  if (!user?.isOnline) return false;
  if (!user.lastSeen) return user.isOnline;
  const lastSeenMs = new Date(user.lastSeen).getTime();
  return Date.now() - lastSeenMs < 2 * 60 * 1000;
};

const sendNotificationEmail = async (userId, type, data) => {
  try {
    console.log('🔔 sendNotificationEmail called:', { userId, type, data });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true }
    });

    if (!user) {
      console.log('🔔 User not found, aborting');
      return { sent: false, reason: 'User not found' };
    }

    let subject = 'LoveMatch Notifications';
    let message = '';
    const notificationData = { ...(data || {}) };

    switch (type) {
      case 'match': {
        const matchUser = await prisma.user.findUnique({
          where: { id: data.matchUserId }
        });
        subject = '💕 New Match on LoveMatch!';
        const matchName = matchUser?.name || 'someone special';
        message = `Great news! You have a new match with ${matchName}. They liked you back! Open LoveMatch to start chatting.`;
        notificationData.userName = matchName;
        break;
      }

      case 'message': {
        const sender = await prisma.user.findUnique({
          where: { id: data.senderId }
        });
        subject = '💬 New Message on LoveMatch';
        const senderName = sender?.name || 'Someone';
        const preview = data.messagePreview || 'New message';
        message = `${senderName} sent you a message: "${preview}" Open LoveMatch to reply.`;
        notificationData.senderName = senderName;
        notificationData.messagePreview = preview;
        break;
      }

      case 'like': {
        const liker = await prisma.user.findUnique({
          where: { id: data.likerId }
        });
        subject = '❤️ Someone Liked You on LoveMatch!';
        const likerName = liker?.name || 'Someone';
        message = `${likerName} liked your profile! Check out who it is and like them back to start a conversation.`;
        notificationData.likerName = likerName;
        break;
      }

      default:
        message = 'You have new activity on LoveMatch. Open the app to see what\'s happening!';
    }

    const allowInApp = shouldNotifyInApp(user.settings, type);
    const onlineNow = isRecentlyOnline(user);
    const allowEmail = !!user.email
      && user.settings?.emailNotifications !== false
      && !onlineNow;

    console.log('🔧 Notification settings:', {
      type,
      settings: user.settings,
      allowInApp
    });

    if (allowInApp) {
      const recent = await prisma.notification.findFirst({
        where: {
          userId,
          type,
          message,
          createdAt: { gte: new Date(Date.now() - 5 * 1000) }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (recent) {
        console.log('🔁 Duplicate notification detected, skipping:', recent.id);
        return {
          sent: false,
          duplicate: true,
          email: user.email,
          subject,
          message,
          createdNotification: false
        };
      }
    }

    let emailError = null;
    if (allowEmail) {
      console.log('📧 Attempting email send:', { to: user.email, subject });
      try {
        await sendEmail({
          to: user.email,
          subject,
          message
        });
      } catch (error) {
        emailError = error.message;
        console.error('📧 Email send failed:', emailError);
      }
    } else {
      console.log('📧 Email skipped:', {
        hasEmail: !!user.email,
        emailNotifications: user.settings?.emailNotifications,
        onlineNow
      });
    }

    if (allowInApp) {
      console.log('🧩 Creating in-app notification');
      await prisma.notification.create({
        data: {
          userId,
          type,
          title: subject,
          message,
          data: notificationData
        }
      });
    }

    console.log('🔔 Notification result:', {
      userId,
      type,
      allowInApp,
      allowEmail,
      onlineNow,
      hasEmail: !!user.email,
      emailError
    });

    return {
      sent: allowEmail && !emailError,
      email: user.email,
      subject,
      message,
      emailError,
      createdNotification: allowInApp
    };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { sent: false, error: error.message };
  }
};

module.exports = { sendNotificationEmail };
