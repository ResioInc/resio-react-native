/**
 * Localized strings for the React Native app
 * Based on iOS Localizable.strings for consistency
 */

export const strings = {
  // ALERT
  alert: {
    openSafari: "Open in Safari",
    copyLink: "Copy link",
    warning: "Warning",
    error: "Error",
    cancel: "Cancel",
    accept: "OK",
    select: "Select",
    confirm: "Confirm",
    message: "Message",
  },

  // HOME
  home: {
    email: {
      msg: "Leave us a message",
      title: "Email",
    },
    phone: {
      title: "Front Office",
    },
    section: {
      title: "How can we help you?",
    },
    faqs: {
      title: "FAQS",
    },
    upcomingEvents: {
      title: "Upcoming Events",
    },
    rsvpEvents: {
      title: "RSVP TO EVENTS",
    },
    amenities: {
      title: "Useful Information",
    },
    property: {
      info: "Property info",
      residentHandbook: "Resident Handbook",
    },
    
    // Home - Community Resources
    communityResources: {
      title: "My community resources",
      more: {
        title: "More resources",
        description: "See what else is out there",
      },
      detail: {
        info: {
          title: "INFORMATION",
        },
        website: {
          title: "WEBSITE",
        },
        files: {
          title: "FILES",
        },
      },
    },

    // Home - WiFi
    wifi: {
      title: "Wi-Fi network",
      description: "View your network and password",
      button: {
        connected: "Connected",
        disconnected: "Connect",
        connecting: "Connecting...",
      },
      info: {
        networkName: "Network Name",
        password: "Password",
        unit: "Unit",
      },
      support: {
        title: "Support",
        subtitle: "Need help with your WiFi connection?",
        text: "Text Support",
        email: "Email Support",
        website: "Support Website",
      },
      noInfo: {
        title: "Support",
        subtitle: "There appears to be no wifi information available for your unit.\n\nIf this seems incorrect, please contact the CBX support team.",
      },
      qrCode: {
        title: "WiFi QR Code",
      },
    },

    // Home - Actions
    actions: {
      payments: {
        title: "Make a payment",
        noBalance: "Great! You have no outstanding charges.",
        disabled: "Your building's leasing system is currently undergoing routine maintenance.",
      },
      bulletins: {
        noNew: "No new bulletins",
        newSingular: "1 new bulletin!",
        newPlural: (count: number) => `${count} new bulletins!`,
      },
      maintenance: "Request maintenance",
    },

    // Home - Property Info
    propertyInfo: {
      contactOffice: "Contact the office",
      residentHandbook: "Resident handbook",
      title: "Property info",
    },
    


    // Home - Contact Office
    contactOfficeDetails: {
      hours: "Office Hours",
      website: "Website",
      handbook: "Resident Handbook",
    },
  },

  // NOTIFICATIONS (Bulletins)
  notifications: {
    title: "Bulletins",
    empty: {
      title: "You'll be the first to know!",
      description: "We'll send you updates as they become available.",
    },
    section: {
      set: "General Settings",
      not: "Notifications",
    },
    roommates: "Shared Information with Roommates",
    roommatesEmail: "Enable Email",
    roommatesPhone: "Enable Phone Number",
    options: {
      rent: "Rent reminders",
      maintenance: "Maintenance updates",
      community: "Community updates",
      allow: "Allow push notifications",
    },
    description: {
      alert: "Please go to Settings and enable push notifications for the Resio application to receive push notifications from this app.",
    },
    alertSetting: "Go To Settings",
  },

  // AUTOPAY
  autopay: {
    active: "Autopay active",
    inactive: "Autopay setup",
  },

  // LOGIN
  login: {
    header: {
      title: "Welcome",
      subtitle: "Enter your information below to get started, we will verify your credentials to get you started.",
    },
    field: {
      email: "Email",
      password: "Password",
    },
    button: {
      login: "Login",
      forgot: "Forgotten password?",
      signup: "Sign Up Now",
    },
    label: {
      welcome: "Enter your information below to access features.",
      welcomeTitle: "Welcome",
      signup: "Don't have an account?",
    },
    unable: "Unable to login with the provided email",
  },

  // LOGOUT
  logout: {
    question: "Do you really want to logout?",
    button: "Logout",
  },

  // EVENTS
  events: {
    details: {
      title: "Event details",
    },
    rsvp: {
      button: {
        attend: "RSVP",
        reject: "I cannot attend",
        full: "Event full",
      },
      success: "Attendance confirmed",
    },
    subtitle: {
      full: "Event full",
      spotsLeft: (count: number) => `${count} spots left`,
      spotsLeftSingular: "1 spot left",
    },
  },

  // MESSAGES
  messages: {
    title: "Messages",
    empty: {
      title: "No messages",
      description: "Any future messages from your property can be will be here. You can also start a conversation with your property manager.",
    },
    button: {
      create: "New message",
    },
    create: {
      title: "New Conversation",
      cancel: "Cancel",
      subject: {
        placeholder: "Enter subject...",
      },
      content: {
        placeholder: "Your message...",
      },
      info: {
        title: "Have a question?",
        description: "Enter a subject and message to start a conversation with your community manager.",
      },
    },
  },

  // PROFILE
  profile: {
    title: "Profile",
    user: {
      unit: (unit: string) => `Unit #${unit}`,
    },
    option: {
      connections: "Connections",
      profile: "Personal information",
      password: "Change password",
      wifi: "Wifi network",
      roommates: "Roommates",
      howItWorks: "How it works",
      tutorial: "Onboarding tutorial",
      leases: "Leases",
      feedback: "App feedback",
      deleteAccount: "Delete my account",
    },
    deleteAccount: {
      defaultExplanation: "Your explanation is entirely optional...",
    },
    bio: {
      title: "Personal Information",
      button: {
        update: "Update",
        save: "Save",
      },
      placeholder: "Profile Biography",
      crop: "Position and Scale",
    },
  },

  // WIFI
  wifi: {
    title: "Wifi network",
    qrCode: {
      title: "Scan to connect",
    },
    button: {
      connected: "Connected",
      disconnected: "Connect",
    },
    info: {
      network: "Wireless network name",
      password: "Password",
      unit: "Unit number",
      unitNumber: (unit: string) => `Unit ${unit}`,
    },
    support: {
      title: "Having issues?",
      subtitle: "Contact the CBX support team",
      text: "Text CBX",
      email: "Email CBX",
    },
      noInfo: {
    subtitle: "There appears to be no wifi information available for your unit.\n\nIf this seems incorrect, please contact the CBX support team.",
  },
  },

  // ROOMMATES
  roommates: {
    title: "Roommates",
    apartmentNumber: "Apartment #",
    you: "You",
  },

  // ERRORS
  error: {
    unknown: "There was an issue submitting your request, contact your management office.",
    networkConnection: "There was an issue submitting your request, contact your management office.",
    user: {
      notExist: {
        title: "Login failed",
        message: "The provided user information isn't valid.",
      },
    },
    field: {
      invalid: "invalid",
      empty: "required",
      passwordNotMatch: " don't match",
    },
    api: {
      declinedError: "There was an issue processing your payment, please ensure the payment method is valid and not expired.",
    },
  },

  // COMMON
  common: {
    continue: "Continue",
    closeExit: "Close & Exit",
    logout: "Logout",
    phone: {
      call: "Call",
      text: "Text",
    },
  },

  // CONNECTIONS (Legacy - keeping for backward compatibility)
  // Note: Updated connections strings are at the end of this file

  // COMMUNITY RESOURCES
  communityResources: {
    info: {
      title: "INFORMATION",
    },
    website: {
      title: "WEBSITE",
    },
    files: {
      title: "FILES",
    },
  },

  // USER TYPE
  userType: {
    resident: {
      description: "Resident",
    },
    guest: {
      description: "Guest",
    },
    guarantor: {
      description: "Guarantor",
    },
  },
  linkedAccounts: {
    title: 'Accounts',
    cardTitle: 'Linked Accounts',
    cardDescription: "Invite people and they'll be able to make payments on your behalf",
    cell: {
      sender: 'You can receive payments from this account',
      connectedSinceFormatted: 'Connected %@',
      removeTitle: 'Remove connection',
    },
    confirmDelete: {
      title: 'Remove Connection',
      description: 'Are you sure you want to remove this connection?',
    },
    empty: {
      title: 'No linked accounts',
      description: 'Once you send an invitation to someone and they accept it, your linked accounts will be displayed here.',
    },
  },
  invitations: {
    title: 'Invitations',
    sendInvite: {
      title: 'Send a new invitation',
      description: 'You will need the email address of the person with whom you wish to connect.',
      cta: 'New invitation',
    },
    cell: {
      didInvite: 'You sent this invitation',
      wasInvited: 'Has invited you to connect',
      ctaTitle: 'Accept Invitation',
      cancelTitle: 'Cancel Invitation',
      declineTitle: 'Decline',
    },
    confirmCancel: {
      title: 'Cancel Invitation',
      description: 'Are you sure you want to cancel this invitation?',
    },
    confirmDecline: {
      title: 'Decline Invitation', 
      description: 'Are you sure you want to decline this invitation?',
    },
    empty: {
      title: 'No invitations',
      description: 'Sent and received invitations will appear here.',
    },
  },
  connections: {
    title: 'Connections',
  },
  newInvitation: {
    title: 'New Invitation',
    header: 'Please enter the email address of the person with whom you wish to connect.',
    emailPlaceholder: 'Email',
    messageFormatted: 'Hi, Let\'s connect on Resio!\n\nWith Resio, you\'ll be able to make payments on my behalf. To get started, simply click the \'Accept invitation\' button.\n\nThanks so much for all your support!\n%@', // %@ will be replaced with user's full name
    buttonTitle: 'Send Invitation',
    howItWorks: {
      item1: {
        title: 'How it works',
        detail: 'An email will be sent for their confirmation. Once they have confirmed, they will be able to make a payment to your account. If you are both residents of our property, they will also be able to see your roommates.',
      },
      item2: {
        title: 'What information is shared?',
        detail: 'When you invite someone, they will see your outstanding balance, recurring charges, and past payments they have made on your lease. We will not share line item details of your charges or your personal information.',
      },
    },
  },
} as const;

// Helper function for dynamic strings with parameters
export const formatString = (template: string, ...args: any[]): string => {
  return template.replace(/%@/g, () => args.shift()?.toString() || '');
};

// Export specific sections for easier imports
export const homeStrings = strings.home;
export const notificationStrings = strings.notifications;
export const loginStrings = strings.login;
export const errorStrings = strings.error;
export const profileStrings = strings.profile;
export const commonStrings = strings.common;
export const eventStrings = strings.events;
export const linkedAccountsStrings = strings.linkedAccounts;
export const invitationsStrings = strings.invitations;
export const connectionsStrings = strings.connections;
export const newInvitationStrings = strings.newInvitation;