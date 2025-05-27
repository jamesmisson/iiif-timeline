import { TimelineItem } from "@/types/TimelineItem";

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

// export function unhighlightItem(target: string | HTMLElement): void {
//   if (typeof target === 'string') {
//     // Handle itemClass (strings starting with 'item_') or ID strings
//     if (target.startsWith('item_')) {
//       // Handle itemClass - remove class from all matching elements
//       document
//         .querySelectorAll(`.${target}`)
//         .forEach((el) => el.classList.remove("hovered"));
//     } else {
//       // Handle ID string - find elements by data-id or data-clustered-ids attributes
//       const elementByDataId: HTMLElement | null = document.querySelector(`[data-id="${target}"]`);
//       if (elementByDataId) {
//         unhighlightItem(elementByDataId);
//         return;
//       }
      
//       // Check for elements with data-clustered-ids containing this ID
//       const elementsWithClusteredIds = document.querySelectorAll('[data-clustered-ids]');
//       for (let i = 0; i < elementsWithClusteredIds.length; i++) {
//         const clusteredIds = elementsWithClusteredIds[i].getAttribute('data-clustered-ids')?.split(' ') || [];
//         if (clusteredIds.includes(target)) {
//           unhighlightItem(elementsWithClusteredIds[i] as HTMLElement);
//           return;
//         }
//       }
//     }
//   } else {
//     // Handle HTMLElement directly
//     target.classList.remove("hovered");
    
//     const targetGroup = target.closest(".vis-group");
//     if (targetGroup) {
//       const targetIndex = Array.from(targetGroup.children).indexOf(target);
//       const axisGroup = document.querySelector(".vis-axis .vis-group");
//       const targetDot = axisGroup?.children[targetIndex];
//       targetDot?.classList.remove("hovered");
      
//       const allClusters = targetGroup.querySelectorAll('.vis-item.vis-cluster');
//       const clusterIndex = Array.from(allClusters).indexOf(target);
//       const itemset = targetGroup.closest(".vis-itemset");
//       const backgroundGroup = itemset?.querySelector('.vis-background .vis-group');
//       const allClusterLines = backgroundGroup?.querySelectorAll('.vis-item.vis-cluster-line');
      
//       if (allClusterLines) {
//         const targetLine = allClusterLines[clusterIndex];
//         targetLine?.classList.remove("hovered");
//       }
//     }
//   }
// }


export function styleSelectedItem(target: string | HTMLElement): void {
  // Always clear existing selections first
  document.querySelectorAll(".vis-selected").forEach((el) => {
    el.classList.remove("vis-selected");
  });

  if (typeof target === 'string') {
    // Handle itemClass (strings starting with 'item_') or ID strings
    if (target.startsWith('item_')) {
      // Handle itemClass - add class to all matching elements
      document
        .querySelectorAll(`.${target}`)
        .forEach((el) => el.classList.add("vis-selected"));
    } else {
      // Handle ID string - find elements by data-id or data-clustered-ids attributes
      const elementByDataId: HTMLElement | null = document.querySelector(`[data-id="${target}"]`);
      if (elementByDataId) {
        // FIX: Extract the item class and style all related elements
        const classList = Array.from(elementByDataId.classList);
        const itemClass = classList.find((cls) => cls.startsWith("item_"));
        
        if (itemClass) {
          // Style all elements with the same item class
          document.querySelectorAll(`.${itemClass}`).forEach((el) => {
            el.classList.add("vis-selected");
          });
        } else {
          // Fallback: just style the found element
          elementByDataId.classList.add("vis-selected");
        }
        return;
      }
      
      // Check for elements with data-clustered-ids containing this ID
      const elementsWithClusteredIds = document.querySelectorAll('[data-clustered-ids]');
      for (let i = 0; i < elementsWithClusteredIds.length; i++) {
        const element = elementsWithClusteredIds[i] as HTMLElement;
        const clusteredIds = element.getAttribute('data-clustered-ids')?.split(' ') || [];
        if (clusteredIds.includes(target)) {
          // Add vis-selected to the cluster element
          element.classList.add("vis-selected");
          
          // Also add to parent element if it exists
          if (element.parentElement) {
            element.parentElement.classList.add("vis-selected");
          }
          
          // Find and style related cluster lines and dots
          const clusterLines = document.querySelectorAll('.vis-background .vis-item.vis-cluster-line');
          const clusterDots = document.querySelectorAll('.vis-axis .vis-item.vis-cluster-dot');
          
          if (clusterLines[i]) {
            clusterLines[i].classList.add("vis-selected");
          }
          if (clusterDots[i]) {
            clusterDots[i].classList.add("vis-selected");
          }
          return;
        }
      }
    }
  } else {
const targetElement = target.classList.contains("vis-item")
  ? target
  : target.parentElement;

if (!targetElement) return;

// Handle HTMLElement directly
targetElement.classList.add("vis-selected");

// Extract item class and style all related elements
const classList = Array.from(targetElement.classList);
const itemClass = classList.find((cls) => cls.startsWith("item_"));

if (itemClass) {
  // Style all elements with the same item class
  document.querySelectorAll(`.${itemClass}`).forEach((el) => {
    el.classList.add("vis-selected");
  });
}

// Handle cluster-specific styling
const targetGroup = targetElement.closest(".vis-group");
if (targetGroup) {
  const targetIndex = Array.from(targetGroup.children).indexOf(targetElement);
  const axisGroup = document.querySelector(".vis-axis .vis-group");
  const targetDot = axisGroup?.children[targetIndex];
  targetDot?.classList.add("vis-selected");

  const allClusters = targetGroup.querySelectorAll('.vis-item.vis-cluster');
  const clusterIndex = Array.from(allClusters).indexOf(targetElement);
  const itemset = targetGroup.closest(".vis-itemset");
  const backgroundGroup = itemset?.querySelector('.vis-background .vis-group');
  const allClusterLines = backgroundGroup?.querySelectorAll('.vis-item.vis-cluster-line');
  if (allClusterLines) {
    const targetLine = allClusterLines[clusterIndex];
    targetLine?.classList.add("vis-selected");
  }
}

  }
}

export function checkForItemCluster(item: TimelineItem | string): HTMLElement | null {
  // checks if item is in a cluster and returns the cluster element if so
  const clusters = document.querySelectorAll('[data-clustered-ids]');
  
  const id = typeof item === 'string' ? item : item.id;

  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i] as HTMLElement;
    const clusteredIds = cluster.getAttribute('data-clustered-ids')?.split(' ') || [];

    if (clusteredIds.includes(id)) {
      return cluster;
    }
  }

  return null;
}