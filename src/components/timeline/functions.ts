export function highlightItem(target: string | HTMLElement): void {
  if (typeof target === 'string') {
    // Handle itemClass (strings starting with 'item_') or ID strings
    if (target.startsWith('item_')) {
      // Handle itemClass - add class to all matching elements
      document
        .querySelectorAll(`.${target}`)
        .forEach((el) => el.classList.add("hovered"));
    } else {
      // Handle ID string - find elements by data-id or data-clustered-ids attributes
      const elementByDataId: HTMLElement | null = document.querySelector(`[data-id="${target}"]`);
      if (elementByDataId) {
        highlightItem(elementByDataId);
        return;
      }
      
      // Check for elements with data-clustered-ids containing this ID
      const elementsWithClusteredIds = document.querySelectorAll('[data-clustered-ids]');
        for (let i = 0; i < elementsWithClusteredIds.length; i++) {
        const clusteredIds = elementsWithClusteredIds[i].getAttribute('data-clustered-ids')?.split(' ') || [];
        if (clusteredIds.includes(target)) {
          highlightItem(elementsWithClusteredIds[i] as HTMLElement);
          return;
        }
      }
    }
  } else {
    // Handle HTMLElement directly
    target.classList.add("hovered");
    
    const targetGroup = target.closest(".vis-group");
    if (targetGroup) {
      const targetIndex = Array.from(targetGroup.children).indexOf(target);
      const axisGroup = document.querySelector(".vis-axis .vis-group");
      const targetDot = axisGroup?.children[targetIndex];
      targetDot?.classList.add("hovered");
      
      const allClusters = targetGroup.querySelectorAll('.vis-item.vis-cluster');
      const clusterIndex = Array.from(allClusters).indexOf(target);
      const itemset = targetGroup.closest(".vis-itemset");
      const backgroundGroup = itemset?.querySelector('.vis-background .vis-group');
      const allClusterLines = backgroundGroup?.querySelectorAll('.vis-item.vis-cluster-line');
      
      if (allClusterLines) {
        const targetLine = allClusterLines[clusterIndex];
        targetLine?.classList.add("hovered");
      }
    }
  }
}

export function unhighlightItem(target: string | HTMLElement): void {
  if (typeof target === 'string') {
    // Handle itemClass (strings starting with 'item_') or ID strings
    if (target.startsWith('item_')) {
      // Handle itemClass - remove class from all matching elements
      document
        .querySelectorAll(`.${target}`)
        .forEach((el) => el.classList.remove("hovered"));
    } else {
      // Handle ID string - find elements by data-id or data-clustered-ids attributes
      const elementByDataId: HTMLElement | null = document.querySelector(`[data-id="${target}"]`);
      if (elementByDataId) {
        unhighlightItem(elementByDataId);
        return;
      }
      
      // Check for elements with data-clustered-ids containing this ID
      const elementsWithClusteredIds = document.querySelectorAll('[data-clustered-ids]');
      for (let i = 0; i < elementsWithClusteredIds.length; i++) {
        const clusteredIds = elementsWithClusteredIds[i].getAttribute('data-clustered-ids')?.split(' ') || [];
        if (clusteredIds.includes(target)) {
          unhighlightItem(elementsWithClusteredIds[i] as HTMLElement);
          return;
        }
      }
    }
  } else {
    // Handle HTMLElement directly
    target.classList.remove("hovered");
    
    const targetGroup = target.closest(".vis-group");
    if (targetGroup) {
      const targetIndex = Array.from(targetGroup.children).indexOf(target);
      const axisGroup = document.querySelector(".vis-axis .vis-group");
      const targetDot = axisGroup?.children[targetIndex];
      targetDot?.classList.remove("hovered");
      
      const allClusters = targetGroup.querySelectorAll('.vis-item.vis-cluster');
      const clusterIndex = Array.from(allClusters).indexOf(target);
      const itemset = targetGroup.closest(".vis-itemset");
      const backgroundGroup = itemset?.querySelector('.vis-background .vis-group');
      const allClusterLines = backgroundGroup?.querySelectorAll('.vis-item.vis-cluster-line');
      
      if (allClusterLines) {
        const targetLine = allClusterLines[clusterIndex];
        targetLine?.classList.remove("hovered");
      }
    }
  }
}