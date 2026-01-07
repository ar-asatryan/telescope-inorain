// ClickUp Integration Utilities
// Workspace/Team ID for inoRain
const CLICKUP_TEAM_ID = '5711523'

// Mapping of project names (lowercase, normalized) to ClickUp folder IDs
// These are from the Development space in ClickUp
const PROJECT_TO_CLICKUP_FOLDER: Record<string, string> = {
  // Main development projects
  'x-player': '90183299200',
  'xplayer': '90183299200',
  'hotelsmarters': '90181561579',
  'hotel smarters': '90181561579',
  'inorain.tv': '97752694',
  'inorain tv': '97752694',
  'inorain ott': '97752694',
  'xcloud': '90183304398',
  'freentvpn': '90185755400',
  'freenet vpn': '90185755400',
  'vpn free net': '90185755400',
  'rebranded apps': '90071136643',
  'inopay': '90183064153',
  'ticketing': '90189798826',
  'era of galaxy': '901810796042',
  
  // Additional projects
  'inorain ott 2026 sprints': '901811258145',
  'samsung/lg stores': '115194809',
  'xcloud test cases': '90020992986',
  'hs project management': '90189218731',
  'hs product documentation': '90189218773',
  'meeting-docs': '90189626269',
  'task templates': '901810962753',
}

/**
 * Get the ClickUp folder URL for a given project name
 * URL format: https://app.clickup.com/{team_id}/v/f/{folder_id}
 */
export function getClickUpFolderUrl(projectName: string): string | null {
  const normalizedName = projectName.toLowerCase().trim()
  
  // Try exact match first
  const folderId = PROJECT_TO_CLICKUP_FOLDER[normalizedName]
  
  if (folderId) {
    return `https://app.clickup.com/${CLICKUP_TEAM_ID}/v/f/${folderId}`
  }
  
  // Try partial match
  for (const [key, id] of Object.entries(PROJECT_TO_CLICKUP_FOLDER)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return `https://app.clickup.com/${CLICKUP_TEAM_ID}/v/f/${id}`
    }
  }
  
  return null
}

/**
 * Get the ClickUp folder ID for a given project name
 */
export function getClickUpFolderId(projectName: string): string | null {
  const normalizedName = projectName.toLowerCase().trim()
  
  const folderId = PROJECT_TO_CLICKUP_FOLDER[normalizedName]
  if (folderId) return folderId
  
  // Try partial match
  for (const [key, id] of Object.entries(PROJECT_TO_CLICKUP_FOLDER)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return id
    }
  }
  
  return null
}

/**
 * Get the ClickUp Development space URL
 */
export function getClickUpDevelopmentSpaceUrl(): string {
  return `https://app.clickup.com/${CLICKUP_TEAM_ID}/v/s/5958883`
}

/**
 * Build a ClickUp folder URL from folder ID
 */
export function buildClickUpFolderUrl(folderId: string): string {
  return `https://app.clickup.com/${CLICKUP_TEAM_ID}/v/f/${folderId}`
}

