import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { FaUsers, FaStar, FaUserFriends, FaSortNumericUp } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import SchoolAdminSideBar from "./SchoolAdminSideBar";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { Download, Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Mingguan");
  const [date, setDate] = useState("2024-07-02");
  const [tvpssVersion, setTvpssVersion] = useState("Memuatkan...");

  // States for counts
  const [studentsCount, setStudentsCount] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(null);
  const [studentCrewsCount, setStudentCrewsCount] = useState(null);

  useEffect(() => {
    // Fetch TVPSS version
    fetch("/get-tvpss-version")
      .then((response) => response.json())
      .then((data) => {
        setTvpssVersion(data.version ?? "Tiada");
      })
      .catch((error) => {
        console.error("Error fetching TVPSS version:", error);
        setTvpssVersion("Error");
      });

    // Fetch counts from the server
    fetch("/school-admin-stats")
      .then((response) => response.json())
      .then((data) => {
        setStudentsCount(data.students_count ?? 0);
        setAchievementsCount(data.achievements_count ?? 0);
        setStudentCrewsCount(data.student_crews_count ?? 0);
      })
      .catch((error) => {
        console.error("Error fetching school stats:", error);
      });
  }, []);

  const barData = {
    labels: ["Januari", "Februari", "Mac", "April", "May", "Jun"],
    datasets: [
      {
        label: "Bilangan Pengguna Mengikut Jenis",
        data: [458, 800, 4000, 700, 543, 3000],
        backgroundColor: ["#455185", "#008080", "#00BFFF"],
        borderColor: ["#455185", "#008080", "#00BFFF"],
        borderWidth: 1,
        borderRadius: 20,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const doughnutData = {
    labels: ["Gaffer", "Jurukamera", "Penemuduga"],
    datasets: [
      {
        label: "Jumlah:",
        data: [200, 300, 150], // Now there are 3 data points, matching the 3 labels
        backgroundColor: ["#455185", "#008080", "#f6ebcb"],
        borderColor: ["#455185", "#008080", "#f6ebcb"], // Border color for each section
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  

  const handleTimeRangeChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeRange(newValue);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="TVPSS | Dashboard" />
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-1/6 bg-white shadow-lg">
          <SchoolAdminSideBar />
        </div>

        <div className="w-full md:ml-[120px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-gray-900 bg-clip-text">Dashboard</h2>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg text-gray-700 mt-2">
              Selamat Datang ke Dashboard School Admin!
            </p>

            <div className="flex items-center space-x-4">
              {/* Toggle Button Group for Time Range */}
              <Box
                component="form"
                className="flex items-center space-x-4"
              >
                <ToggleButtonGroup
                  value={timeRange}
                  exclusive
                  onChange={handleTimeRangeChange}
                  aria-label="Time Range"
                  sx={{
                    backgroundColor: "#f2f5f7",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    "& .MuiToggleButtonGroup-grouped": {
                      textTransform: "none",
                      fontWeight: "500",
                      fontSize: "14px",
                      padding: "10px 20px",
                      border: "none",
                      color: "#374151",
                      "&.Mui-selected": {
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        color: "#000",
                        fontWeight: "600",
                      },
                      "&:hover": {
                        backgroundColor: "#f2f5f7",
                      },
                    },
                  }}
                >
                  <ToggleButton value="Harian">Harian</ToggleButton>
                  <ToggleButton value="Mingguan">Mingguan</ToggleButton>
                  <ToggleButton value="Bulanan">Bulanan</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <input
                type="date"
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button className="bg-[#4158A6] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#3C4565] transform hover:scale-105 transition duration-300">
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <SummaryCard
              title="Bilangan Pelajar Sekolah"
              value={studentsCount ?? "Memuatkan..."}
              icon={<FaUsers />}
              bgColor="#f6ebcb"
              iconColor="#9d8338"
            />
            <SummaryCard
              title="Bilangan Pencapaian"
              value={achievementsCount ?? "Memuatkan..."}
              icon={<FaStar />}
              bgColor="#cbf6d1"
              iconColor="#287033"
            />
            <SummaryCard
              title="Bilangan Krew Pelajar"
              value={studentCrewsCount ?? "Memuatkan..."}
              icon={<FaUserFriends />}
              bgColor="#bbd1ef"
              iconColor="#0f3365"
            />
            <SummaryCard
              title="Versi TVPSS Terkini"
              value={tvpssVersion}
              icon={<FaSortNumericUp />}
              bgColor="#e6e6fa"
              iconColor="#6a0dad"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Bilangan Krew Mengikut Bulanan</h3>
              <Bar data={barData} options={barOptions} />
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Jumlah Peratusan Krew Mengikut Jawatan</h3>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 border-t bg-white text-gray-600">
        © 2024 Kementerian Pendidikan Malaysia (KPM)
      </footer>
    </AuthenticatedLayout>
  );
}

function SummaryCard({ title, value, icon, bgColor, iconColor }) {
  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-gray-150 flex items-center gap-4 hover:scale-105 transform transition duration-300 ease-in-out">
      <div
        className="rounded-full p-4 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div style={{ color: iconColor, fontSize: "40px" }}>{icon}</div>
      </div>
      <div className="text-black">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
