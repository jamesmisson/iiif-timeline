export interface TimelineItem {
    className?: string;
    align?: string;
    content: string;
    end?: Date | number | string;
    group?: any;
    id: string;
    selectable?: boolean;
    start: string;
    style?: string;
    subgroup?: string | number;
    title?: string;
    type?: 'box' | 'point' | 'range' | 'background';
    limitSize?: boolean;
  }
  