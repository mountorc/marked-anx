export function handleTapSet(tapSet, data, element) {
  if (!tapSet || typeof tapSet !== 'object') return;

  const tapHandler = (event) => {
    Object.keys(tapSet).forEach(actionType => {
      const actionConfig = tapSet[actionType];
      handleAction(actionType, actionConfig, data, event, element);
    });
  };

  element.addEventListener('click', tapHandler);
  return tapHandler;
}

export function handleTriggerSet(triggerSet, data, element) {
  if (!triggerSet || typeof triggerSet !== 'object') return {};

  const handlers = {};

  Object.keys(triggerSet).forEach(triggerType => {
    const actionConfig = triggerSet[triggerType];
    const eventType = mapTriggerTypeToEvent(triggerType);
    
    if (eventType) {
      const handler = (event) => {
        Object.keys(actionConfig).forEach(actionType => {
          handleAction(actionType, actionConfig[actionType], data, event, element);
        });
      };

      element.addEventListener(eventType, handler);
      handlers[triggerType] = handler;
    }
  });

  return handlers;
}

export function generateEventHandlers(config, data, element) {
  const handlers = {};

  if (config.tapSet) {
    handlers.tap = handleTapSet(config.tapSet, data, element);
  }

  if (config.triggerSet) {
    handlers.triggers = handleTriggerSet(config.triggerSet, data, element);
  }

  return handlers;
}

export function addEventListeners(element, config, data) {
  return generateEventHandlers(config, data, element);
}

function mapTriggerTypeToEvent(triggerType) {
  const eventMap = {
    input: 'input',
    focus: 'focus',
    blur: 'blur',
    submit: 'submit',
    tap: 'click',
    longtap: 'contextmenu', // Using contextmenu as long tap alternative
    doubletap: 'dblclick',
    cancel: 'cancel',
    clear: 'input'
  };

  return eventMap[triggerType] || null;
}

function handleAction(actionType, actionConfig, data, event, element) {
  switch (actionType) {
    case 'navigateTo':
      handleNavigateTo(actionConfig, data, event);
      break;
    case 'navigateBack':
      handleNavigateBack(actionConfig, event);
      break;
    case 'updateData':
      handleUpdateData(actionConfig, data, event);
      break;
    case 'setTimeout':
      handleSetTimeout(actionConfig, data, event, element);
      break;
    case 'requestSet':
      handleRequestSet(actionConfig, data, event);
      break;
    default:
      console.warn(`Unknown action type: ${actionType}`);
  }
}

function handleNavigateTo(config, data, event) {
  if (!config.path) return;

  let path = config.path;
  const params = new URLSearchParams();

  if (config.paramMap && typeof config.paramMap === 'object') {
    Object.keys(config.paramMap).forEach(targetParam => {
      const sourceField = config.paramMap[targetParam];
      const value = getDataValue(data, sourceField);
      if (value !== undefined) {
        params.set(targetParam, value);
      }
    });
  }

  const queryString = params.toString();
  if (queryString) {
    path = `${path}?${queryString}`;
  }

  window.location.href = path;
}

function handleNavigateBack(config, event) {
  window.history.back();
}

function handleUpdateData(config, data, event) {
  if (!config.tableName) return;

  // This is a placeholder implementation
  // In a real application, this would update the data in a dataset
  console.log('Updating data:', {
    tableName: config.tableName,
    paramMap: config.paramMap,
    uniqueMap: config.uniqueMap,
    data
  });
}

function handleSetTimeout(config, data, event, element) {
  if (!config.delay) return;

  setTimeout(() => {
    if (config.action) {
      handleAction(config.action.type, config.action.config, data, event, element);
    }
  }, config.delay);
}

function handleRequestSet(config, data, event) {
  if (!config.url) return;

  const params = new URLSearchParams();

  if (config.paramMap && typeof config.paramMap === 'object') {
    Object.keys(config.paramMap).forEach(targetParam => {
      const sourceField = config.paramMap[targetParam];
      const value = getDataValue(data, sourceField);
      if (value !== undefined) {
        params.set(targetParam, value);
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `${config.url}?${queryString}` : config.url;

  // This is a placeholder implementation
  // In a real application, this would make an actual API request
  console.log('Sending request:', url);
  
  fetch(url)
    .then(response => response.json())
    .then(responseData => {
      console.log('Request response:', responseData);
    })
    .catch(error => {
      console.error('Request error:', error);
    });
}

function getDataValue(data, fieldPath) {
  if (!data || !fieldPath) return undefined;

  const parts = fieldPath.split('.');
  let value = data;

  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }

  return value;
}