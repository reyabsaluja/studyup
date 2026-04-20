'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import type { AnalyticsData } from '@/lib/types'

interface AnalyticsChartsProps {
  studyData: AnalyticsData[]
  activityData: AnalyticsData[]
  courseDistribution: { name: string; value: number; color: string }[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#1E1E2E] px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm text-[#A1A1AA]">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-medium text-[#FAFAFA]">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsCharts({
  studyData,
  activityData,
  courseDistribution,
}: AnalyticsChartsProps) {
  const totalHours = courseDistribution.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-8">
      {/* Study Hours Line Chart */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141420] p-6">
        <h3 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Study Hours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={studyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              axisLine={{ stroke: '#71717A' }}
              tickLine={{ stroke: '#71717A' }}
            />
            <YAxis
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              axisLine={{ stroke: '#71717A' }}
              tickLine={{ stroke: '#71717A' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name="Hours"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#studyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Heatmap Bar Chart */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141420] p-6">
        <h3 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Daily Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              axisLine={{ stroke: '#71717A' }}
              tickLine={{ stroke: '#71717A' }}
            />
            <YAxis
              stroke="#71717A"
              tick={{ fill: '#71717A', fontSize: 12 }}
              axisLine={{ stroke: '#71717A' }}
              tickLine={{ stroke: '#71717A' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Activity" radius={[4, 4, 0, 0]}>
              {activityData.map((entry, index) => {
                const maxValue = Math.max(...activityData.map((d) => d.value), 1)
                const intensity = entry.value / maxValue
                const opacity = 0.3 + intensity * 0.7
                return <Cell key={index} fill={`rgba(139, 92, 246, ${opacity})`} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Course Distribution Pie/Donut Chart */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141420] p-6">
        <h3 className="mb-4 text-lg font-semibold text-[#FAFAFA]">Course Distribution</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={courseDistribution}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              paddingAngle={2}
              label={false}
            >
              {courseDistribution.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-[#A1A1AA]">{value}</span>
              )}
            />
            {/* Center total label */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#FAFAFA]"
            >
              <tspan x="50%" dy="-8" fontSize="24" fontWeight="bold">
                {totalHours}
              </tspan>
              <tspan x="50%" dy="22" fontSize="12" fill="#71717A">
                Total Hours
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
