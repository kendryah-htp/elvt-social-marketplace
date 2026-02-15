// Super Admin emails - hardwired for authorization checks
const SUPER_ADMIN_EMAILS = [
  'kendryah@gmail.com',
  'support@highticketpurpose.com',
  'support@elvt.social',
  'denahornsby@yahoo.com'
];

/**
 * Check if a user is a Super Admin based on email
 * @param {string} userEmail - The user's email address
 * @returns {boolean} - True if user is Super Admin
 */
export function isSuperAdmin(userEmail) {
  if (!userEmail) return false;
  return SUPER_ADMIN_EMAILS.includes(userEmail.toLowerCase());
}

/**
 * Check if user can read a prompt
 * Super Admins: can read all
 * Regular users: can read active global prompts and their own personal prompts
 */
export function canReadPrompt(prompt, userEmail) {
  if (isSuperAdmin(userEmail)) return true;
  if (prompt.status === 'active' && !prompt.owner_email) return true; // Global active prompt
  if (prompt.owner_email === userEmail) return true; // Own personal prompt
  return false;
}

/**
 * Check if user can edit a prompt
 * Super Admins: can edit all
 * Regular users: can edit their own personal prompts only
 */
export function canEditPrompt(prompt, userEmail) {
  if (isSuperAdmin(userEmail)) return true;
  if (prompt.owner_email === userEmail) return true;
  return false;
}

/**
 * Check if user can delete a prompt
 * Super Admins: can delete all
 * Regular users: can delete their own personal prompts only
 */
export function canDeletePrompt(prompt, userEmail) {
  return canEditPrompt(prompt, userEmail);
}

/**
 * Check if user can pin a prompt (admin only)
 * Only Super Admins can pin prompts globally
 */
export function canPinPrompt(userEmail) {
  return isSuperAdmin(userEmail);
}

/**
 * Check if user can create a global prompt (admin only)
 * Only Super Admins can create global prompts (owner_email = null)
 */
export function canCreateGlobalPrompt(userEmail) {
  return isSuperAdmin(userEmail);
}

/**
 * Get the owner_email value for a new prompt
 * Super Admins creating global prompts: null
 * Everyone else: their own email
 */
export function getPromptOwnerEmail(userEmail, isGlobal = false) {
  if (isGlobal && isSuperAdmin(userEmail)) {
    return null;
  }
  return userEmail;
}