import React from 'react';

import { Widget } from '../../types';
import AverageItemsPerSale from './AverageItemsPerSale';
import AverageSpendPerSale from './AverageSpendPerSale';
import AvItemsPerSaleToday from './AvItemsPerSaleToday';
import AvItemsPerSaleTodayHourly from './AvItemsPerSaleTodayHourly';
import AvSpendPerSaleToday from './AvSpendPerSaleToday';
import AvSpendPerSaleTodayHourly from './AvSpendPerSaleTodayHourly';
import BussinessGrowth from './BussinessGrowth';
import CashCommitments from './CashCommitments';
import CashPositionAndCoverage from './CashPositionAndCoverage';
import GrossProfit from './GrossProfit';
import HighGrossingProductsToday from './HighGrossingProductsToday';
import MoneyOwed from './MoneyOwed';
import MoneyOwedMoneyOwing from './MoneyOwedMoneyOwing';
import SalesByDay from './SalesByDay';
import SalesByMonth from './SalesByMonth';
import SalesByWeek from './SalesByWeek';
import SalesTodayHourly from './SalesTodayHourly';
import SalesTransactionsToday from './SalesTransactionsToday';
import SalesTransactionsTodayHourly from './SalesTransactionsTodayHourly';
import TopSellingProducts from './TopSellingProducts';
import TopSellingProductsToday from './TopSellingProductsToday';
import TotalSalesToday from './TotalSalesToday';
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
  'product-sales-by-value': HighGrossingProductsToday,
  'sales-volume-today-d': SalesTransactionsTodayHourly,
  'average-spend-per-sale-today': AvSpendPerSaleToday,
  'sales-revenue-today-a': TotalSalesToday,
  'sales-revenue-today-b': SalesTodayHourly,
  'sales-volume-today-c': SalesTransactionsToday,
  'average-item-per-sale-hourly': AvItemsPerSaleTodayHourly,
  'average-spend-per-sale-hourly': AvSpendPerSaleTodayHourly,
  'average-item-per-sale-today': AvItemsPerSaleToday,
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
