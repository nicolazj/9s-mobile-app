import React from 'react';

import AverageItemsPerSale from './AverageItemsPerSale';
import AverageSpendPerSale from './AverageSpendPerSale';
import AvItemsPerSaleToday from './AvItemsPerSaleToday';
import AvItemsPerSaleTodayHourly from './AvItemsPerSaleTodayHourly';
import AvSpendPerSaleToday from './AvSpendPerSaleToday';
import AvSpendPerSaleTodayHourly from './AvSpendPerSaleTodayHourly';
import BookedLeave from './BookedLeave';
import BussinessGrowth from './BussinessGrowth';
import CampaignPerformance from './CampaignPerformance';
import CashCommitments from './CashCommitments';
import CashPositionAndCoverage from './CashPositionAndCoverage';
import DaysToPay from './DaysToPay';
import GrossProfit from './GrossProfit';
import HighGrossingProductsToday from './HighGrossingProductsToday';
import MoneyOwed from './MoneyOwed';
import MoneyOwedMoneyOwing from './MoneyOwedMoneyOwing';
import MoneyOwing from './MoneyOwing';
import ProductGrossProfit from './ProductGrossProfit';
import SalesByDay from './SalesByDay';
import SalesByMonth from './SalesByMonth';
import SalesByWeek from './SalesByWeek';
import SalesStaffPerformance from './SalesStaffPerformance';
import SalesTodayHourly from './SalesTodayHourly';
import SalesTransactionsToday from './SalesTransactionsToday';
import SalesTransactionsTodayHourly from './SalesTransactionsTodayHourly';
import TopPerformingCampaigns from './TopPerformingCampaigns';
import TopSellingProducts from './TopSellingProducts';
import TopSellingProductsToday from './TopSellingProductsToday';
import TotalSalesToday from './TotalSalesToday';
import widgetWebsiteGoalConversions from './WebsiteGoalConversions';
import widgetWebsiteTraffic from './WebsiteTraffic';
import WorkingToday from './WorkingToday';

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
  'campaign-performance': CampaignPerformance,
  'top-performing-campaigns': TopPerformingCampaigns,
  'product-gross-profit': ProductGrossProfit,
  'sales-staff-performance': SalesStaffPerformance,
  'booked-leave': BookedLeave,
  'working-today': WorkingToday,
  'days-to-pay': DaysToPay,
  'money-owing': MoneyOwing,
};

export const getWidgetByKey = (key: string) => {
  const widget = widgetsMap[key];
  return widget;
};
