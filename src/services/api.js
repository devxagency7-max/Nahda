/* --------------------------------------------------------------------------
   API SERVICE LAYER
   Establishes clean data exchange contracts and methods for future REST/GraphQL
   backend integration without breaking existing client-side operations.
   -------------------------------------------------------------------------- */

export const ApiService = {
  /**
   * Mock endpoint: Search cases by multi-criteria criteria
   * @param {string} mode - 'nid' | 'phone' | 'charity' | 'region' | 'date'
   * @param {string} query - Query string or selection value
   * @returns {Promise<Object>}
   */
  async searchCases(mode, query) {
    // Standard API response contract readiness
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          queryMode: mode,
          queryText: query,
          timestamp: new Date().toISOString()
        });
      }, 50);
    });
  },

  /**
   * Mock endpoint: Save family member record
   * @param {Object} memberData
   * @returns {Promise<Object>}
   */
  async saveFamilyMember(memberData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: memberData
        });
      }, 50);
    });
  },

  /**
   * Mock endpoint: Save background configuration
   * @param {Object} bgSettings
   * @returns {Promise<Object>}
   */
  async saveBgSettings(bgSettings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          settings: bgSettings
        });
      }, 50);
    });
  }
};
