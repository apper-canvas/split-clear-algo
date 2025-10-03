import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import expenseService from "@/services/api/expenseService";

function Insights() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [collaboratorData, setCollaboratorData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [allExpenses, categoryTotals, dailySpending, topCollaborators] = await Promise.all([
        expenseService.getAll(),
        expenseService.getCategoryTotals(),
        expenseService.getDailySpending(7),
        expenseService.getCollaboratorFrequency()
      ]);
      
      setExpenses(allExpenses);
      prepareChartData(categoryTotals, dailySpending, topCollaborators);
    } catch (err) {
      setError("Failed to load insights data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (categoryTotals, dailySpending, topCollaborators) => {
    // Category Pie Chart
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    
    setCategoryData({
      series: amounts,
      options: {
        chart: {
          type: "pie",
          fontFamily: "Inter, sans-serif"
        },
        labels: categories,
        colors: ["#3498DB", "#27AE60", "#F39C12", "#E74C3C", "#9B59B6", "#16A085", "#E67E22", "#34495E"],
        legend: {
          position: "bottom",
          fontSize: "14px"
        },
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val.toFixed(1) + "%";
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "₹" + val.toFixed(0);
            }
          }
        }
      }
    });

    // Trend Line Chart
    const dates = Object.keys(dailySpending);
    const dailyAmounts = Object.values(dailySpending);
    
    setTrendData({
      series: [{
        name: "Daily Spending",
        data: dailyAmounts
      }],
      options: {
        chart: {
          type: "line",
          fontFamily: "Inter, sans-serif",
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          labels: {
            style: {
              fontSize: "12px"
            }
          }
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return "₹" + val.toFixed(0);
            },
            style: {
              fontSize: "12px"
            }
          }
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        colors: ["#3498DB"],
        markers: {
          size: 4,
          colors: ["#3498DB"],
          strokeColors: "#fff",
          strokeWidth: 2
        },
        grid: {
          borderColor: "#e5e7eb"
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "₹" + val.toFixed(0);
            }
          }
        }
      }
    });

    setCollaboratorData(topCollaborators);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (expenses.length === 0) {
    return <Empty message="No expenses yet. Add your first expense to see insights!" />;
  }

  return (
    <div className="px-6 py-8 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-h1 font-display font-bold text-primary mb-6">
          Spending Insights
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Spending by Category */}
          {categoryData && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="PieChart" size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-h2 font-display font-semibold text-primary">
                    Spending by Category
                  </h2>
                  <p className="text-caption text-secondary">
                    Your expense distribution
                  </p>
                </div>
              </div>
              <ReactApexChart
                options={categoryData.options}
                series={categoryData.series}
                type="pie"
                height={320}
              />
            </Card>
          )}

          {/* Spending Trends */}
          {trendData && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-success" />
                </div>
                <div>
                  <h2 className="text-h2 font-display font-semibold text-primary">
                    Spending Trends
                  </h2>
                  <p className="text-caption text-secondary">
                    Last 7 days activity
                  </p>
                </div>
              </div>
              <ReactApexChart
                options={trendData.options}
                series={trendData.series}
                type="line"
                height={280}
              />
            </Card>
          )}

          {/* Top Collaborators */}
          {collaboratorData.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Users" size={20} className="text-warning" />
                </div>
                <div>
                  <h2 className="text-h2 font-display font-semibold text-primary">
                    Top Collaborators
                  </h2>
                  <p className="text-caption text-secondary">
                    Most frequent split partners
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {collaboratorData.map((collaborator, index) => (
                  <div
                    key={collaborator.name}
                    className="flex items-center justify-between p-3 bg-surface rounded-xl border border-secondary/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-caption font-bold text-accent">
                          #{index + 1}
                        </span>
                      </div>
                      <span className="text-body font-medium text-primary">
                        {collaborator.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <ApperIcon name="Receipt" size={16} />
                      <span className="text-body font-semibold">
                        {collaborator.count} {collaborator.count === 1 ? "expense" : "expenses"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Insights;