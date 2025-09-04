import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CsvDataContextType {
  csvData: Record<string, string>[]; // An array of objects, where keys are CSV headers
  loading: boolean;
}

const CsvDataContext = createContext<CsvDataContextType | undefined>(undefined);

interface CsvDataProviderProps {
  children: ReactNode;
  fileUrl: string;
}

const parseCsv = (csvText: string): Record<string, string>[] => {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(",").map((header) => header.trim());
  const dataRows = lines.slice(1);
  return dataRows.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const entry: Record<string, string> = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
};

export const CsvDataProvider = ({
  children,
  fileUrl,
}: CsvDataProviderProps) => {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const csvText = await response.text();
        const parsedData = parseCsv(csvText);
        setData(parsedData);
      } catch (e: any) {
        console.error("Failed to load or parse CSV file:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileUrl]);

  const value = { csvData: data, loading };
  return (
    <CsvDataContext.Provider value={value}>{children}</CsvDataContext.Provider>
  );
};
export const useCsvData = () => {
  const context = useContext(CsvDataContext);
  if (context === undefined) {
    throw new Error("useCsvData must be used within a CsvDataProvider");
  }
  return context;
};
