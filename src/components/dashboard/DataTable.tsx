import { useState } from 'react';
import { CarData } from '@/types/car';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface DataTableProps {
  data: CarData[];
}

export const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

  const manufacturers = ['all', ...Array.from(new Set(data.map(car => car.Manufacturer))).sort()];
  const vehicleTypes = ['all', ...Array.from(new Set(data.map(car => car.Vehicle_type).filter(Boolean))).sort()];

  const filteredData = data.filter(car => {
    const matchesSearch = 
      car.Manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.Model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesManufacturer = manufacturerFilter === 'all' || car.Manufacturer === manufacturerFilter;
    const matchesVehicleType = vehicleTypeFilter === 'all' || car.Vehicle_type === vehicleTypeFilter;
    
    return matchesSearch && matchesManufacturer && matchesVehicleType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Sales Data</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by manufacturer or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map(m => (
                <SelectItem key={m} value={m}>
                  {m === 'all' ? 'All Manufacturers' : m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map(vt => (
                <SelectItem key={vt} value={vt}>
                  {vt === 'all' ? 'All Types' : vt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Sales (k)</TableHead>
                <TableHead className="text-right">Price ($k)</TableHead>
                <TableHead className="text-right">Horsepower</TableHead>
                <TableHead className="text-right">Fuel Efficiency</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((car, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{car.Manufacturer}</TableCell>
                    <TableCell>{car.Model}</TableCell>
                    <TableCell className="text-right">{car.Sales_in_thousands?.toFixed(2) || '-'}</TableCell>
                    <TableCell className="text-right">{car.Price_in_thousands?.toFixed(2) || '-'}</TableCell>
                    <TableCell className="text-right">{car.Horsepower || '-'}</TableCell>
                    <TableCell className="text-right">{car.Fuel_efficiency || '-'}</TableCell>
                    <TableCell>{car.Vehicle_type || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Showing {filteredData.length} of {data.length} cars
        </p>
      </CardContent>
    </Card>
  );
};
