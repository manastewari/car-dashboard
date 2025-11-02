import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { CarData } from '@/types/car';

interface ScatterPlotProps {
  data: CarData[];
}

export const ScatterPlot = ({ data }: ScatterPlotProps) => {
  const scatterData = data
    .filter(car => car.Price_in_thousands && car.Horsepower)
    .map(car => ({
      x: car.Horsepower,
      y: car.Price_in_thousands,
      z: car.Sales_in_thousands || 5,
      name: `${car.Manufacturer} ${car.Model}`
    }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Horsepower" 
          className="text-xs fill-muted-foreground"
          label={{ value: 'Horsepower', position: 'insideBottom', offset: -10 }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Price" 
          className="text-xs fill-muted-foreground"
          label={{ value: 'Price ($1000s)', angle: -90, position: 'insideLeft' }}
        />
        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Sales" />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem'
          }}
          formatter={(value: any, name: string) => {
            if (name === 'Horsepower') return [value, 'HP'];
            if (name === 'Price') return [`$${value}k`, 'Price'];
            if (name === 'Sales') return [value, 'Sales (k)'];
            return [value, name];
          }}
        />
        <Scatter name="Cars" data={scatterData} fill="hsl(var(--chart-2))" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
