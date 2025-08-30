import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrafficData {
  date: string;
  visits: number;
  uniqueVisitors: number;
  avgViewTime: string;
}

interface TrafficTableProps {
  data: TrafficData[];
}

export const TrafficTable = ({ data }: TrafficTableProps) => {
  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Last 7 Days Traffic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Visits</TableHead>
              <TableHead className="text-muted-foreground">Unique Visitors</TableHead>
              <TableHead className="text-muted-foreground">Avg. View Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No data available yet
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell>{row.visits}</TableCell>
                  <TableCell>{row.uniqueVisitors}</TableCell>
                  <TableCell>{row.avgViewTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};