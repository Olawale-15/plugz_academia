import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { IconComponent } from '../../../shared/icon/icon.component';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // Dashboard Cards Data
  dashboardCards = [
    {
      title: 'Total Students',
      count: 1542,
      change: '+8.2%',
      changeType: 'increase',
      icon: 'users',
      color: '#9b51e0',
      bgColor: 'rgba(155, 81, 224, 0.1)'
    },
    {
      title: 'Total Staff',
      count: 87,
      change: '+2.1%',
      changeType: 'increase',
      icon: 'user-check',
      color: '#06d6a0',
      bgColor: 'rgba(6, 214, 160, 0.1)'
    },
    {
      title: 'Total Classes',
      count: 24,
      change: '0%',
      changeType: 'neutral',
      icon: 'book-open',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Pending Fees',
      count: 45280,
      change: '-5.3%',
      changeType: 'decrease',
      icon: 'credit-card',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      prefix: '$'
    }
  ];

  // Chart Configuration for Enrollment Trends
  public enrollmentChartType: ChartType = 'line';
  public enrollmentChartData: ChartConfiguration['data'] = {
    labels: ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6'],
    datasets: [
      {
        label: 'Student Enrollment',
        data: [1200, 1350, 1450, 1420, 1480, 1542],
        borderColor: '#9b51e0',
        backgroundColor: 'rgba(155, 81, 224, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#9b51e0',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  public enrollmentChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter'
          },
          color: '#374151',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#9b51e0',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter'
          },
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter'
          },
          color: '#6b7280'
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    }
  };

  // Recent Activities Data
  recentActivities = [
    {
      type: 'enrollment',
      message: 'New student John Doe enrolled in Grade 10',
      time: '2 minutes ago',
      icon: 'user-plus',
      color: '#9b51e0'
    },
    {
      type: 'payment',
      message: 'Fee payment of $500 received from Sarah Wilson',
      time: '15 minutes ago',
      icon: 'credit-card',
      color: '#06d6a0'
    },
    {
      type: 'class',
      message: 'New Mathematics class scheduled for Grade 9',
      time: '1 hour ago',
      icon: 'calendar',
      color: '#f59e0b'
    },
    {
      type: 'staff',
      message: 'Teacher Maria Garcia updated her profile',
      time: '2 hours ago',
      icon: 'user',
      color: '#3b82f6'
    }
  ];

  ngOnInit() {
    // Component initialization
  }

  formatNumber(num: number, prefix: string = ''): string {
    if (num >= 1000) {
      return prefix + (num / 1000).toFixed(1) + 'K';
    }
    return prefix + num.toLocaleString();
  }

}
