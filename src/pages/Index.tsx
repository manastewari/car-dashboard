import { useMemo } from 'react';
import { DollarSign, Car, TrendingUp, Gauge } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { PieChartComponent } from '@/components/dashboard/PieChartComponent';
import { ScatterPlot } from '@/components/dashboard/ScatterPlot';
import { DataTable } from '@/components/dashboard/DataTable';
import { parseCarData, getTopManufacturers, getVehicleTypeDistribution, getTopModels } from '@/utils/carDataParser';

const Index = () => {
  const carData = useMemo(() => parseCarData(), []);
  const topManufacturers = useMemo(() => getTopManufacturers(carData), [carData]);
  const vehicleTypeDistribution = useMemo(() => getVehicleTypeDistribution(carData), [carData]);
  const topModels = useMemo(() => getTopModels(carData), [carData]);

  const totalSales = useMemo(() => 
    carData.reduce((sum, car) => sum + (car.Sales_in_thousands || 0), 0).toFixed(2),
    [carData]
  );

  const averagePrice = useMemo(() => {
    const prices = carData.filter(car => car.Price_in_thousands).map(car => car.Price_in_thousands);
    return (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2);
  }, [carData]);

  const topManufacturer = useMemo(() => 
    topManufacturers[0]?.name || 'N/A',
    [topManufacturers]
  );

  const avgFuelEfficiency = useMemo(() => {
    const efficiencies = carData.filter(car => car.Fuel_efficiency).map(car => car.Fuel_efficiency);
    return (efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length).toFixed(1);
  }, [carData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Car Sales Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into automotive sales performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Sales"
            value={`${totalSales}k`}
            icon={TrendingUp}
            description="Units sold (thousands)"
          />
          <MetricCard
            title="Average Price"
            value={`$${averagePrice}k`}
            icon={DollarSign}
            description="Average vehicle price"
          />
          <MetricCard
            title="Top Manufacturer"
            value={topManufacturer}
            icon={Car}
            description="By sales volume"
          />
          <MetricCard
            title="Avg Fuel Efficiency"
            value={`${avgFuelEfficiency} MPG`}
            icon={Gauge}
            description="Miles per gallon"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard 
            title="Top 10 Manufacturers by Sales" 
            description="Sales volume in thousands"
          >
            <SalesChart data={topManufacturers} />
          </ChartCard>

          <ChartCard 
            title="Vehicle Type Distribution" 
            description="Sales breakdown by vehicle type"
          >
            <PieChartComponent data={vehicleTypeDistribution} />
          </ChartCard>
        </div>

        <ChartCard 
          title="Price vs Horsepower Analysis" 
          description="Bubble size represents sales volume"
        >
          <ScatterPlot data={carData} />
        </ChartCard>

        <ChartCard 
          title="Top 10 Models by Sales" 
          description="Best-selling car models"
        >
          <SalesChart data={topModels} />
        </ChartCard>

        {/* Data Table */}
        <DataTable data={carData} />
      </div>
    </div>
  );
};

export default Index;
