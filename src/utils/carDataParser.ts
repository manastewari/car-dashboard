import { CarData } from "@/types/car";
import carSalesCSV from "@/assets/Car_sales.csv?raw";

export const parseCarData = (): CarData[] => {
  const lines = carSalesCSV.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const car: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      car[header] = value === '' ? null : 
                    isNaN(Number(value)) ? value : Number(value);
    });
    
    return car as CarData;
  }).filter(car => car.Manufacturer); // Filter out any empty rows
};

export const getTopManufacturers = (data: CarData[], limit: number = 10) => {
  const manufacturerSales = data.reduce((acc, car) => {
    if (car.Sales_in_thousands) {
      acc[car.Manufacturer] = (acc[car.Manufacturer] || 0) + car.Sales_in_thousands;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(manufacturerSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, sales]) => ({ name, sales: Number(sales.toFixed(2)) }));
};

export const getVehicleTypeDistribution = (data: CarData[]) => {
  const distribution = data.reduce((acc, car) => {
    if (car.Vehicle_type && car.Sales_in_thousands) {
      acc[car.Vehicle_type] = (acc[car.Vehicle_type] || 0) + car.Sales_in_thousands;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2))
  }));
};

export const getTopModels = (data: CarData[], limit: number = 10) => {
  return data
    .filter(car => car.Sales_in_thousands)
    .sort((a, b) => b.Sales_in_thousands - a.Sales_in_thousands)
    .slice(0, limit)
    .map(car => ({
      name: `${car.Manufacturer} ${car.Model}`,
      sales: car.Sales_in_thousands
    }));
};
