// 导航组件渲染逻辑

/**
 * 渲染导航组件
 * @param {Object} component - 导航配置
 * @returns {string} - 渲染后的 HTML
 */
export function renderNavigation(component) {
  try {
    // 生成导航 HTML
    return generateNavigationHTML(component);
  } catch (error) {
    console.error('Error rendering navigation:', error);
    return `<div class="anx-error">Error rendering navigation: ${error.message}</div>`;
  }
}

/**
 * 生成导航 HTML
 * @param {Object} navigation - 导航配置
 * @returns {string} - 导航 HTML
 */
function generateNavigationHTML(navigation) {
  // 获取显示模式，默认为list
  const showMode = navigation.showMode || (navigation.config?.showMode) || 'list';
  
  // 根据显示模式生成不同的HTML
  if (showMode === 'header') {
    return generateHeaderNavigation(navigation);
  } else {
    return generateListNavigation(navigation);
  }
}

/**
 * 生成头部导航HTML
 * @param {Object} navigation - 导航配置
 * @returns {string} - 头部导航HTML
 */
function generateHeaderNavigation(navigation) {
  // 收集所有导航项
  let navItems = [];
  
  // 获取当前选中的菜单nick
  const selectedNick = navigation.value;
  console.log("Selected nick:", selectedNick);
  
  if (Array.isArray(navigation)) {
    // 如果是数组，直接使用
    navItems = navigation;
  } else if (navigation.items) {
    // 如果是单个导航对象，使用其 items
    navItems = navigation.items;
  } else if (navigation.config && navigation.config.items) {
    // 如果是 {config:{kind:"navigation",items:[]}} 格式，使用 config.items
    navItems = navigation.config.items;
  } else {
    // 如果是单个导航项，包装成数组
    navItems = [navigation];
  }
  
  // 设置显示阈值
  const maxVisibleItems = 7;
  // 分离可见项和更多项
  const visibleItems = navItems.slice(0, maxVisibleItems);
  const moreItems = navItems.slice(maxVisibleItems);
  
  let html = `
    <nav class="anx-nav" style="background-color: white; border-bottom: 1px solid #e9ecef; padding: 0.75rem 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <div class="anx-nav-container" style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <a href="/" class="anx-nav-logo" style="font-size: 1.5rem; font-weight: bold; color: #409eff; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; flex-shrink: 0;">
          ${navigation.title || navigation.config?.title || 'marked-ANX-demo'}
        </a>
        <ul class="anx-nav-menu" style="list-style: none; display: flex; gap: 0.5rem; margin: 0;">
  `;

  // 渲染可见的导航项
  visibleItems.forEach(item => {
    html += generateNavigationItem(item, 'header', selectedNick);
  });
  
  // 如果有更多项，渲染"更多"下拉菜单
  if (moreItems.length > 0) {
    html += `
          <li class="anx-nav-item" style="position: relative;">
            <a href="#" class="anx-nav-link" onclick="event.preventDefault(); const dropdown = this.nextElementSibling; if (dropdown.style.display === 'block') { dropdown.style.display = 'none'; } else { dropdown.style.display = 'block'; }" style="display: block; padding: 0.75rem 1rem; color: #495057; text-decoration: none; border-radius: 0.375rem; transition: all 0.2s ease; font-size: 0.95rem;">
              <span style="color: #409eff; font-weight: 500;">更多</span>
            </a>
            <ul class="anx-nav-dropdown-menu" style="position: absolute; top: 100%; right: 0; min-width: 240px; background-color: white; border: 1px solid #e9ecef; border-radius: 0.375rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 0.5rem 0; margin: 0.25rem 0 0; z-index: 1000; display: none; transition: all 0.2s ease;">
    `;
    
    moreItems.forEach(item => {
      // 判断是否是选中的菜单项
      const isSelected = selectedNick && item.nick === selectedNick;
      // 选中状态的样式
      const selectedStyle = isSelected ? 'color: #409eff; font-weight: 500; background-color: #ecf5ff;' : '';
      
      const url = item.url_page || '#';
      html += `
                <li style="list-style: none;">
                  <a href="${url}" class="anx-nav-dropdown-item" style="display: block; padding: 0.625rem 1.25rem; color: #495057; text-decoration: none; transition: all 0.2s ease; font-size: 0.9rem; ${selectedStyle};">
                    <span style="color: #409eff; font-weight: 500;">${item.title}</span>
                  </a>
                </li>
      `;
    });
    
    html += `
            </ul>
          </li>
    `;
  }

  html += `
        </ul>
      </div>
      <style>
        .anx-nav-item:hover .anx-nav-dropdown-menu {
          display: block;
        }
        .anx-nav-link:hover {
          background-color: #f0f7ff;
        }
        .anx-nav-dropdown-item:hover {
          background-color: #f0f7ff;
        }
      </style>
      <script>
        // 添加点击事件处理，确保在移动设备上也能正常工作
        document.addEventListener('DOMContentLoaded', function() {
          const navItems = document.querySelectorAll('.anx-nav-item');
          navItems.forEach(item => {
            const link = item.querySelector('.anx-nav-link');
            const dropdown = item.querySelector('.anx-nav-dropdown-menu');
            if (link && dropdown) {
              link.addEventListener('click', function(e) {
                // 阻止默认行为
                e.preventDefault();
                // 切换下拉菜单显示状态
                if (dropdown.style.display === 'block') {
                  dropdown.style.display = 'none';
                } else {
                  dropdown.style.display = 'block';
                }
              });
            }
          });
          
          // 点击其他地方关闭下拉菜单
          document.addEventListener('click', function(e) {
            if (!e.target.closest('.anx-nav-item')) {
              const dropdowns = document.querySelectorAll('.anx-nav-dropdown-menu');
              dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
              });
            }
          });
        });
      </script>
    </nav>
  `;

  return html;
}

/**
 * 生成列表导航HTML
 * @param {Object} navigation - 导航配置
 * @returns {string} - 列表导航HTML
 */
function generateListNavigation(navigation) {
  // 获取当前选中的菜单nick
  const selectedNick = navigation.value;
  console.log("Selected nick (list mode):", selectedNick);
  
  let html = `
    <div class="anx-nav-list" style="background-color: white; border: 1px solid #e9ecef; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      <h2 class="anx-nav-list-title" style="font-size: 1.25rem; font-weight: 600; color: #495057; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12L5 14L12 7L19 14L21 12L12 3L3 12Z" stroke="#409eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Navigation
      </h2>
      <ul class="anx-nav-list-items" style="list-style: none; margin: 0; padding: 0;">
  `;

  // 处理导航项
  if (Array.isArray(navigation)) {
    // 如果是数组，遍历所有导航项
    navigation.forEach(item => {
      html += generateNavigationItem(item, 'list', selectedNick);
    });
  } else if (navigation.items) {
    // 如果是单个导航对象，处理其 items
    navigation.items.forEach(item => {
      html += generateNavigationItem(item, 'list', selectedNick);
    });
  } else if (navigation.config && navigation.config.items) {
    // 如果是 {config:{kind:"navigation",items:[]}} 格式，处理 config.items
    navigation.config.items.forEach(item => {
      html += generateNavigationItem(item, 'list', selectedNick);
    });
  } else {
    // 如果是单个导航项，直接处理
    html += generateNavigationItem(navigation, 'list', selectedNick);
  }

  html += `
      </ul>
    </div>
  `;

  return html;
}

/**
 * 生成单个导航项的 HTML
 * @param {Object} item - 导航项配置
 * @returns {string} - 导航项 HTML
 */
function generateNavigationItem(item, mode = 'list', selectedNick = null) {
  // 生成导航链接
  const url = item.url_page || '#';
  
  if (mode === 'header') {
    // 判断是否是选中的菜单项
    const isSelected = selectedNick && item.nick === selectedNick;
    // 选中状态的样式
    const selectedStyle = isSelected ? 'color: #409eff; font-weight: 500; background-color: #ecf5ff;' : '';
    
    // Header模式：去掉description
    let html = `
          <li class="anx-nav-item" style="position: relative;">
            <a href="${url}" class="anx-nav-link" ${item.items && item.items.length > 0 ? 'onclick="event.preventDefault(); const dropdown = this.nextElementSibling; if (dropdown.style.display === \'block\') { dropdown.style.display = \'none\'; } else { dropdown.style.display = \'block\'; }"' : ''} style="display: block; padding: 0.75rem 1rem; color: #495057; text-decoration: none; border-radius: 0.375rem; transition: all 0.2s ease; font-size: 0.95rem; ${selectedStyle}">
              <span style="color: #409eff; font-weight: 500;">${item.title}</span>
            </a>
    `;
    
    // 处理子菜单
    if (item.items && item.items.length > 0) {
      html += `
                <ul class="anx-nav-dropdown-menu" style="position: absolute; top: 100%; left: 0; min-width: 240px; background-color: white; border: 1px solid #e9ecef; border-radius: 0.375rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 0.5rem 0; margin: 0.25rem 0 0; z-index: 1000; display: none; transition: all 0.2s ease;">
      `;
      
      item.items.forEach(subItem => {
        const subUrl = subItem.url_page || '#';
        // 判断子菜单项是否是选中状态
        const isSubItemSelected = selectedNick && subItem.nick === selectedNick;
        // 子菜单选中状态的样式
        const subItemSelectedStyle = isSubItemSelected ? 'color: #409eff; font-weight: 500; background-color: #ecf5ff;' : '';
        
        html += `
                  <li style="list-style: none;">
                    <a href="${subUrl}" class="anx-nav-dropdown-item" style="display: block; padding: 0.625rem 1.25rem; color: #495057; text-decoration: none; transition: all 0.2s ease; font-size: 0.9rem; ${subItemSelectedStyle};">
                      <span style="color: #409eff; font-weight: 500;">${subItem.title}</span>
                    </a>
                  </li>
        `;
      });
      
      html += `
                </ul>
      `;
    }
    
    html += `
          </li>
    `;
    
    return html;
  } else {
    // List模式：显示title、路径和description
    // 判断是否是选中的菜单项
    const isSelected = selectedNick && item.nick === selectedNick;
    // 选中状态的样式
    const selectedStyle = isSelected ? 'color: #409eff; font-weight: 500; background-color: #ecf5ff;' : '';
    
    let html = `
          <li class="anx-nav-list-item" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f3f5;">
            <a href="${url}" class="anx-nav-list-link" style="display: block; text-decoration: none; color: #495057; transition: all 0.2s ease; ${selectedStyle};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                <span style="font-weight: 500; color: #409eff;">${item.title}</span>
                <span style="font-size: 0.8rem; color: #6c757d; background-color: #f8f9fa; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${url}</span>
              </div>
              ${item.description ? `<p style="font-size: 0.875rem; color: #6c757d; margin: 0;">${item.description}</p>` : ''}
            </a>
    `;
    
    // 处理子菜单
    if (item.items && item.items.length > 0) {
      html += `
                <ul class="anx-nav-list-subitems" style="list-style: none; margin: 0.75rem 0 0 1.5rem; padding: 0;">
      `;
      
      item.items.forEach(subItem => {
        const subUrl = subItem.url_page || '#';
        // 判断子菜单项是否是选中状态
        const isSubItemSelected = selectedNick && subItem.nick === selectedNick;
        // 子菜单选中状态的样式
        const subItemSelectedStyle = isSubItemSelected ? 'color: #409eff; font-weight: 500; background-color: #ecf5ff;' : '';
        
        html += `
                  <li class="anx-nav-list-subitem" style="margin-bottom: 0.5rem;">
                    <a href="${subUrl}" class="anx-nav-list-sublink" style="display: block; text-decoration: none; color: #495057; font-size: 0.875rem; transition: all 0.2s ease; ${subItemSelectedStyle};">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.125rem;">
                        <span style="font-weight: 500; color: #495057;">${subItem.title}</span>
                        <span style="font-size: 0.75rem; color: #6c757d; background-color: #f8f9fa; padding: 0.125rem 0.375rem; border-radius: 0.25rem;">${subUrl}</span>
                      </div>
                      ${subItem.description ? `<p style="font-size: 0.75rem; color: #6c757d; margin: 0;">${subItem.description}</p>` : ''}
                    </a>
                  </li>
        `;
      });
      
      html += `
                </ul>
      `;
    }
    
    html += `
          </li>
    `;
    
    return html;
  }
}
