import StatCard from "../components/DashboardComponents/StatCard";
import SalesChartCard from "../components/DashboardComponents/SalesChartCard";
import OrderCard from "../components/DashboardComponents/OrderCard";

export default function Dashboard() {
    return (
        <div>
            <div class="bg-gray block  dark:bg-gray-800 dark:border-gray-700">
    <div class="flex justify-between">
        <h1 class="text-xl font-semibold text-white-900 sm:text-2xl dark:text-white">Dashboard</h1>

        <div class="inline-flex items-center gap-1 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"></path>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"></path>
            </svg>

            Thursday, 06 Nov, 01:18 PM
        </div>
    </div>
</div>

        <div className="grid lg:grid-cols-3">

            {/* Left Section */}
            <div className="col-span-2 p-4">
                <h1 className="text-xl font-semibold text-white-900 dark:text-white mb-4 px-4">Statistics</h1>
                <div className="grid xl:grid-cols-2 gap-4">
                    <StatCard title="Today's Orders" value="4" percent="400" isUp />
                    <StatCard title="Today's Earnings" value="$1200" percent="120000" isUp />
                    <StatCard title="Today's Customers" value="0" percent="0" />
                    <StatCard title="Average Daily Earnings" value="$200" percent="20000" isUp />
                </div>

                {/* Sales Chart */}
                <div className="mt-6">
                    <SalesChartCard value="$1200" percent="120000" subtitle="Sales This Month">
                        {/* Chart will come here */}
                    </SalesChartCard>
                </div>
            </div>

            {/* Right Section - Orders */}
            <div className="p-4">
                <h1 className="text-xl font-semibold text-white-900 dark:text-white mb-4">Today Orders</h1>
                <div className="grid gap-4">
                    <OrderCard
                        table="T01"
                        orderNo="3"
                        status="KOT"
                        statusText="Cooking Now"
                        time="November 06, 2025 11:07 AM"
                        items="1 Item(s)"
                        total="$200"
                    />


                </div>
            </div>
        </div>
        </div>
    );
}
