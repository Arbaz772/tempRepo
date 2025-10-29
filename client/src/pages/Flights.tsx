// TestFlightSearch.tsx - Diagnostic Component
// Add this temporarily to your app to test the data flow

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestFlightSearch() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log("🧪 Starting diagnostic test...");

      // Test 1: Check API connectivity
      const healthResponse = await fetch('/api/health');
      const healthData = await healthResponse.json();
      console.log("✅ Health check:", healthData);

      // Test 2: Perform actual flight search
      const searchParams = {
        origin: 'DEL',
        destination: 'BOM',
        departDate: '2025-11-15',
        passengers: 1,
        tripType: 'one-way'
      };

      console.log("🔍 Testing flight search with:", searchParams);

      const searchResponse = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });

      console.log("📡 Response status:", searchResponse.status);
      console.log("📡 Response headers:", Object.fromEntries(searchResponse.headers.entries()));

      const searchData = await searchResponse.json();
      console.log("📦 Response data:", searchData);

      // Analyze the response
      const analysis = {
        status: searchResponse.status,
        ok: searchResponse.ok,
        hasData: !!searchData.data,
        dataIsArray: Array.isArray(searchData.data),
        dataLength: searchData.data?.length || 0,
        dataStructure: searchData.data?.[0] ? Object.keys(searchData.data[0]) : [],
        fullResponse: searchData,
        sampleFlight: searchData.data?.[0],
        health: healthData
      };

      console.log("📊 Analysis:", analysis);
      setTestResult(analysis);

    } catch (error: any) {
      console.error("❌ Test failed:", error);
      setTestResult({
        error: true,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto my-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">🔬 Flight Search Diagnostic</h2>
          <p className="text-sm text-muted-foreground">
            This will test the complete data flow from backend to frontend
          </p>
        </div>

        <Button 
          onClick={runTest} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Running Tests..." : "🧪 Run Diagnostic Test"}
        </Button>

        {testResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
              <pre className="text-xs">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>

            {!testResult.error && (
              <div className="mt-4 space-y-2">
                <div className={`p-3 rounded ${testResult.ok ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  <strong>API Status:</strong> {testResult.ok ? '✅ OK' : '❌ Failed'}
                </div>
                <div className={`p-3 rounded ${testResult.hasData ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  <strong>Has Data:</strong> {testResult.hasData ? '✅ Yes' : '❌ No'}
                </div>
                <div className={`p-3 rounded ${testResult.dataIsArray ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                  <strong>Data is Array:</strong> {testResult.dataIsArray ? '✅ Yes' : '⚠️ No'}
                </div>
                <div className={`p-3 rounded ${testResult.dataLength > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                  <strong>Flights Found:</strong> {testResult.dataLength}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold mb-2">What to check:</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>API Status should be 200 (OK)</li>
            <li>Has Data should be ✅ Yes</li>
            <li>Data is Array should be ✅ Yes</li>
            <li>Flights Found should be &gt; 0</li>
            <li>Check dataStructure to see flight object keys</li>
            <li>Check sampleFlight to see actual data format</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

// To use this component, add it to your app temporarily:
// import TestFlightSearch from './components/TestFlightSearch';
// 
// In your route/page:
// <TestFlightSearch />