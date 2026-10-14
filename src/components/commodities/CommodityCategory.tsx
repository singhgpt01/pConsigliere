import React from 'react';

export interface CategoryTab {
  id: string;
  label: string;
}

export interface CommodityCategoryProps {
  categories: CategoryTab[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CommodityCategory: React.FC<CommodityCategoryProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="commodities-nav-bar" role="tablist" aria-label="Commodity Categories">
      {categories.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeCategory === tab.id}
          className={`category-tab-btn ${activeCategory === tab.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
