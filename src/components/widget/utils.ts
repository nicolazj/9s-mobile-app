import React from 'react';

import { Widget } from '../../types';
import AverageItemsPerSale from './AverageItemsPerSale';
import AverageSpendPerSale from './AverageSpendPerSale';
import BussinessGrowth from './BussinessGrowth';
import CashCommitments from './CashCommitments';
import CashPositionAndCoverage from './CashPositionAndCoverage';
import GrossProfit from './GrossProfit';
import MoneyOwed from './MoneyOwed';
import MoneyOwedMoneyOwing from './MoneyOwedMoneyOwing';
import SalesByDay from './SalesByDay';
import SalesByMonth from './SalesByMonth';
import SalesByWeek from './SalesByWeek';
import TopSellingProducts from './TopSellingProducts';
import TopSellingProductsToday from './TopSellingProductsToday';
import widgetWebsiteGoalConversions, { sample as widgetWebsiteGoalConversionsSample } from './WebsiteGoalConversions';
import widgetWebsiteTraffic from './WebsiteTraffic';

interface WidgetMap {
  [key: string]: React.ComponentType<any>;
}
const widgetsMap: WidgetMap = {
  'website-conversions': widgetWebsiteGoalConversions,
  'website-traffic': widgetWebsiteTraffic,
  'sales-by-month': SalesByMonth,
  'sales-by-day': SalesByDay,
  'business-growth': BussinessGrowth,
  'cash-position-and-coverage': CashPositionAndCoverage,
  'gross-profit': GrossProfit,
  'money-owed': MoneyOwed,
  'money-owed-and-money-owing': MoneyOwedMoneyOwing,
  'cash-commitments': CashCommitments,
  'average-items-per-sale': AverageItemsPerSale,
  'average-spend-per-sale': AverageSpendPerSale,
  'top-selling-products': TopSellingProducts,
  'sales-by-week': SalesByWeek,
  'product-sales-by-volume': TopSellingProductsToday,
};
interface WidgetDataMap {
  [key: string]: Widget;
}
const WidgetDataMap: WidgetDataMap = {
  'website-conversions': widgetWebsiteGoalConversionsSample,
};

export const getWidgetByKey = (key: string) => {
  const widget = widgetsMap[key];

  return widget;
};

export const getWidgetSampleByKey = (key: string): Widget => {
  const sample = WidgetDataMap[key];
  return sample;
};
