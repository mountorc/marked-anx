/**
 * Dataset utility for ANX components
 * Handles both uuid_dataset and url_dataset
 */

/**
 * Fetch dataset data based on configuration
 * @param {Object} datasetConfig - Dataset configuration object
 * @returns {Promise<Array>} - Promise that resolves to the dataset data
 */
export async function fetchDataset(datasetConfig) {
  if (!datasetConfig) {
    return [];
  }

  if (datasetConfig.uuid_dataset) {
    return fetchLocalDataset(datasetConfig.uuid_dataset);
  } else if (datasetConfig.url_dataset) {
    return fetchUrlDataset(datasetConfig.url_dataset);
  }

  return [];
}

/**
 * Fetch dataset by UUID (local implementation)
 * @param {string} uuid - Dataset UUID
 * @returns {Promise<Array>} - Promise that resolves to the dataset data
 */
async function fetchLocalDataset(uuid) {
  // In a real implementation, this would fetch from a local store or API
  // For now, return empty array as placeholder
  return [];
}

/**
 * Fetch dataset from URL
 * @param {string} url - URL to fetch dataset from
 * @returns {Promise<Array>} - Promise that resolves to the dataset data
 */
async function fetchUrlDataset(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching dataset from URL:', error);
    return [];
  }
}