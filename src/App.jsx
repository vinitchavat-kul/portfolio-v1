import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [processInput, setProcessInput] = useState('')
  const [pythonCode, setPythonCode] = useState('')
  
  // OT Calculator States
  const [salary, setSalary] = useState('')
  const [weekdayOT, setWeekdayOT] = useState('')
  const [holidayOT, setHolidayOT] = useState('')
  const [otResults, setOtResults] = useState(null)
  const [otHistory, setOtHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Delete specific history entry
  const deleteHistoryEntry = (id) => {
    setOtHistory(prevHistory => prevHistory.filter(entry => entry.id !== id))
  }

  // Export to CSV functionality
  const exportToCSV = () => {
    if (otHistory.length === 0) {
      alert('ไม่มีข้อมูลประวัติที่จะส่งออก')
      return
    }

    // Create CSV headers
    const headers = ['วันที่คำนวณ', 'เงินเดือน', 'ชั่วโมง OT วันธรรมดา', 'จำนวนเงิน OT วันธรรมดา', 'ชั่วโมง OT วันหยุด', 'จำนวนเงิน OT วันหยุด', 'ยอดเงินรวม OT', 'อัตราต่อชั่วโมง']
    
    // Create CSV data
    const csvData = otHistory.map(entry => [
      entry.date,
      entry.salary,
      entry.weekdayHours,
      entry.weekdayOTAmount,
      entry.holidayHours,
      entry.holidayOTAmount,
      entry.totalOT,
      entry.hourlyRate
    ])

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `OT_History_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy summary to clipboard
  const copySummaryToClipboard = async () => {
    const totalAmount = otHistory.reduce((sum, entry) => sum + entry.totalOT, 0)
    const totalCount = otHistory.length
    const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0
    
    const summary = `📊 สรุปประวัติ OT
📅 วันที่: ${new Date().toLocaleDateString('th-TH')}
💰 ยอด OT รวม: ฿${totalAmount.toLocaleString()}
📈 จำนวนครั้ง: ${totalCount} ครั้ง
📊 เฉลี่ยต่อครั้ง: ฿${avgAmount.toLocaleString()}

🔗 จาก Portfolio OT Calculator`

    try {
      await navigator.clipboard.writeText(summary)
      // Show success feedback
      const button = document.getElementById('copy-summary-btn')
      if (button) {
        const originalText = button.textContent
        button.textContent = '✅ คัดลอกแล้ว!'
        button.classList.add('bg-green-600', 'hover:bg-green-700')
        setTimeout(() => {
          button.textContent = originalText
          button.classList.remove('bg-green-600', 'hover:bg-green-700')
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy summary:', err)
      alert('ไม่สามารถคัดลอกข้อมูลได้ กรุณาลองใหม่')
    }
  }

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('otHistory')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        if (Array.isArray(parsedHistory)) {
          setOtHistory(parsedHistory)
        }
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem('otHistory')
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (otHistory.length > 0) {
        localStorage.setItem('otHistory', JSON.stringify(otHistory))
      }
    } catch (error) {
      console.error('Error saving history to localStorage:', error)
    }
  }, [otHistory])

  const saveToHistory = () => {
    if (!otResults) return
    
    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleString('th-TH'),
      salary: parseFloat(salary),
      weekdayHours: parseFloat(weekdayOT),
      holidayHours: parseFloat(holidayOT),
      totalOT: parseFloat(otResults.totalOT),
      weekdayOTAmount: parseFloat(otResults.weekdayOTAmount),
      holidayOTAmount: parseFloat(otResults.holidayOTAmount),
      hourlyRate: parseFloat(otResults.hourlyRate)
    }
    
    console.log('Saving to history:', historyEntry)
    setOtHistory(prevHistory => {
      const newHistory = [historyEntry, ...prevHistory]
      console.log('New history:', newHistory)
      return newHistory
    })
  }

  const clearHistory = () => {
    console.log('Clearing history')
    setOtHistory([])
    localStorage.removeItem('otHistory')
  }

  // Filter history based on search and filter type
  const getFilteredHistory = () => {
    let filtered = [...otHistory]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.salary.toString().includes(searchTerm) ||
        entry.totalOT.toString().includes(searchTerm) ||
        entry.weekdayHours.toString().includes(searchTerm) ||
        entry.holidayHours.toString().includes(searchTerm)
      )
    }
    
    // Apply type filter
    switch (filterType) {
      case 'over1000':
        filtered = filtered.filter(entry => entry.totalOT > 1000)
        break
      case 'over5000':
        filtered = filtered.filter(entry => entry.totalOT > 5000)
        break
      case 'over10000':
        filtered = filtered.filter(entry => entry.totalOT > 10000)
        break
      case 'weekdayOnly':
        filtered = filtered.filter(entry => entry.weekdayHours > 0 && entry.holidayHours === 0)
        break
      case 'holidayOnly':
        filtered = filtered.filter(entry => entry.holidayHours > 0 && entry.weekdayHours === 0)
        break
      case 'bothTypes':
        filtered = filtered.filter(entry => entry.weekdayHours > 0 && entry.holidayHours > 0)
        break
      default:
        // 'all' - no additional filtering
        break
    }
    
    return filtered
  }

  const convertToCode = () => {
    if (!processInput.trim()) return
    
    const steps = processInput.split('->').map(step => step.trim())
    let code = `# Automated Process: ${processInput}\n`
    code += `import time\n\n`
    code += `def automated_process():\n`
    code += `    """\n`
    code += `    Automated workflow converted from business process\n`
    code += `    """\n`
    
    steps.forEach((step, index) => {
      const functionName = step.toLowerCase().replace(/\s+/g, '_')
      code += `    # Step ${index + 1}: ${step}\n`
      code += `    print("Executing: ${step}")\n`
      code += `    ${functionName}()\n`
      code += `    time.sleep(1)  # Simulate processing time\n\n`
    })
    
    code += `    print("Process completed successfully!")\n\n`
    
    steps.forEach((step, index) => {
      const functionName = step.toLowerCase().replace(/\s+/g, '_')
      code += `def ${functionName}():\n`
      code += `    """Implementation for ${step}"""\n`
      code += `    # Add your ${step.toLowerCase()} logic here\n`
      code += `    pass\n\n`
    })
    
    code += `if __name__ == "__main__":\n`
    code += `    automated_process()`
    
    setPythonCode(code)
  }

  const calculateOT = () => {
    const salaryNum = parseFloat(salary) || 0
    const weekdayHours = parseFloat(weekdayOT) || 0
    const holidayHours = parseFloat(holidayOT) || 0
    
    if (salaryNum <= 0) {
      setOtResults(null)
      return
    }
    
    // Calculate hourly rate: (salary / 30) / 8
    const hourlyRate = salaryNum / 30 / 8
    
    // Calculate OT amounts
    const weekdayOTAmount = hourlyRate * 1.5 * weekdayHours
    const holidayOTAmount = hourlyRate * 3 * holidayHours
    const totalOT = weekdayOTAmount + holidayOTAmount
    
    setOtResults({
      hourlyRate: hourlyRate.toFixed(2),
      weekdayOTAmount: weekdayOTAmount.toFixed(2),
      holidayOTAmount: holidayOTAmount.toFixed(2),
      totalOT: totalOT.toFixed(2),
      weekdayHours,
      holidayHours
    })
  }

  // Real-time calculation
  useEffect(() => {
    calculateOT()
  }, [salary, weekdayOT, holidayOT])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">Portfolio</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">Home</a>
                <a href="#journey" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">My Logic Journey</a>
                <a href="#playground" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">Logic Playground</a>
                <a href="#ot-calculator" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">OT Calculator</a>
                <a href="#skills" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">Skills</a>
                <a href="#contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">RPA to AI</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 mb-6">
            Software Developer
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Transforming automation expertise into intelligent AI solutions. From UiPath workflows to cutting-edge AI agents.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#journey" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
              Explore My Journey
            </a>
            <a href="#contact" className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* My Logic Journey Section */}
      <section id="journey" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">My Logic Journey</span>
          </h2>
          
          <div className="space-y-12">
            {/* RPA Phase */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">RPA Foundation</h3>
                  <p className="text-gray-400">UiPath Automation Expert</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Mastered the art of business process automation with UiPath. Designed and implemented complex workflows that streamlined operations across multiple industries.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">UiPath Studio</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Orchestrator</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">REFramework</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Process Mining</span>
              </div>
            </div>

            {/* Transition Phase */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-400">The Transition</h3>
                  <p className="text-gray-400">From Rules to Intelligence</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Discovered the limitations of rule-based automation and embraced the power of AI. Began exploring machine learning, natural language processing, and intelligent agents.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Machine Learning</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">API Integration</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Data Analysis</span>
              </div>
            </div>

            {/* AI Phase */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 card-hover">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400">AI Development</h3>
                  <p className="text-gray-400">Building Intelligent Solutions</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Now creating sophisticated AI agents and intelligent systems that learn, adapt, and make decisions. Combining RPA efficiency with AI intelligence.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">LangChain</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">OpenAI APIs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logic Playground Section */}
      <section id="playground" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Logic Playground</span>
          </h2>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-8 text-center">
              Transform your business processes into automated Python code. Try typing something like "Check Email {'->'} Download Invoice {'->'} Send Report"
            </p>
            
            <div className="space-y-6">
              {/* Input Section */}
              <div>
                <label htmlFor="process-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Process
                </label>
                <input
                  id="process-input"
                  type="text"
                  value={processInput}
                  onChange={(e) => setProcessInput(e.target.value)}
                  placeholder="e.g., Check Email {'->'} Download Invoice {'->'} Send Report"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Convert Button */}
              <div className="text-center">
                <button
                  onClick={convertToCode}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!processInput.trim()}
                >
                  Convert to Code
                </button>
              </div>
              
              {/* Output Section */}
              {pythonCode && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Generated Python Code</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(pythonCode)}
                      className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
                    >
                      Copy Code
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-600 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      <code>{pythonCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OT Calculator Section */}
      <section id="ot-calculator" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">เครื่องคำนวณ OT</span>
          </h2>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-8 text-center">
              คำนวณค่าล่วงเวลาทำงาน (OT) ตามกฎหมายแรงงานไทย โดยอัตโนมัติ
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Salary Input */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">
                  เงินเดือน (บาท)
                </label>
                <input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salary}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || parseFloat(value) >= 0) {
                      setSalary(value)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="15000"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Weekday OT Input */}
              <div>
                <label htmlFor="weekday-ot" className="block text-sm font-medium text-gray-300 mb-2">
                  ชั่วโมง OT วันธรรมดา (1.5 เท่า)
                </label>
                <input
                  id="weekday-ot"
                  type="number"
                  min="0"
                  step="0.5"
                  value={weekdayOT}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || parseFloat(value) >= 0) {
                      setWeekdayOT(value)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="8"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Holiday OT Input */}
              <div>
                <label htmlFor="holiday-ot" className="block text-sm font-medium text-gray-300 mb-2">
                  ชั่วโมง OT วันหยุด (3 เท่า)
                </label>
                <input
                  id="holiday-ot"
                  type="number"
                  min="0"
                  step="0.5"
                  value={holidayOT}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || parseFloat(value) >= 0) {
                      setHolidayOT(value)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                      e.preventDefault()
                    }
                  }}
                  placeholder="4"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Results Section */}
            {otResults && (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">สรุปยอด OT</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">อัตราค่าแรงต่อชั่วโมง:</span>
                        <span className="text-gray-200 font-semibold">฿{otResults.hourlyRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">OT วันธรรมดา ({otResults.weekdayHours} ชม.):</span>
                        <span className="text-blue-400 font-semibold">฿{otResults.weekdayOTAmount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">OT วันหยุด ({otResults.holidayHours} ชม.):</span>
                        <span className="text-purple-400 font-semibold">฿{otResults.holidayOTAmount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center">
                      <p className="text-white/80 text-sm mb-1">ยอดเงินรวม OT</p>
                      <p className="text-white text-3xl font-bold">฿{otResults.totalOT}</p>
                    </div>
                  </div>
                </div>
                
                {/* Calculation Formula */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-gray-400 text-sm">
                    <strong>สูตรการคำนวณ:</strong> (เงินเดือน ÷ 30 ÷ 8) × เรท OT × จำนวนชั่วโมง
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={saveToHistory}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    บันทึกประวัติ
                  </button>
                </div>
              </div>
            )}
            
            {!otResults && (
              <div className="text-center py-8">
                <p className="text-gray-400">กรุณากรอกข้อมูลเพื่อคำนวณค่า OT</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OT History Section */}
      {otHistory.length > 0 && (
        <section className="py-10 px-4 bg-gray-800/20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-300">ประวัติการคำนวณ OT</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    id="copy-summary-btn"
                    onClick={copySummaryToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    📋 คัดลอกสรุป
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    📥 ส่งออก CSV
                  </button>
                  <button
                    onClick={clearHistory}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    🗑️ ลบทั้งหมด
                  </button>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="mb-6 space-y-4">
                {/* Search Input */}
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาตามวันที่, เงินเดือน, ชั่วโมง OT, หรือยอดเงิน..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Filter Options */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="over1000">OT เกิน 1,000 บาท</option>
                    <option value="over5000">OT เกิน 5,000 บาท</option>
                    <option value="over10000">OT เกิน 10,000 บาท</option>
                    <option value="weekdayOnly">เฉพาะ OT วันธรรมดา</option>
                    <option value="holidayOnly">เฉพาะ OT วันหยุด</option>
                    <option value="bothTypes">OT ทั้งสองประเภท</option>
                  </select>
                  
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFilterType('all')
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
                
                {/* Filter Summary */}
                <div className="text-sm text-gray-400">
                  แสดง {getFilteredHistory().length} จาก {otHistory.length} รายการ
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-center shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-white/90 text-base font-medium">ยอด OT รวมทั้งหมด</p>
                  </div>
                  <p className="text-white text-3xl font-bold">฿{otHistory.reduce((sum, entry) => sum + entry.totalOT, 0).toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-center shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="text-white/90 text-base font-medium">จำนวนครั้งที่ทำ OT</p>
                  </div>
                  <p className="text-white text-3xl font-bold">{otHistory.length} ครั้ง</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm">วันที่คำนวณ</th>
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm">เงินเดือน</th>
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm">OT วันธรรมดา</th>
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm">OT วันหยุด</th>
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm">ยอดรวม OT</th>
                        <th className="px-2 sm:px-4 py-3 text-gray-300 font-semibold text-xs sm:text-sm text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredHistory().map((entry) => (
                        <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 text-xs sm:text-sm">{entry.date}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-sm">฿{entry.salary.toLocaleString()}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-400 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <span>{entry.weekdayHours} ชม.</span>
                              <span className="text-xs sm:text-xs sm:ml-1">(฿{entry.weekdayOTAmount.toLocaleString()})</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-purple-400 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <span>{entry.holidayHours} ชม.</span>
                              <span className="text-xs sm:text-xs sm:ml-1">(฿{entry.holidayOTAmount.toLocaleString()})</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-green-400 font-bold text-xs sm:text-sm">฿{entry.totalOT.toLocaleString()}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <button
                              onClick={() => deleteHistoryEntry(entry.id)}
                              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            >
                              <span className="hidden sm:inline">ลบ</span>
                              <span className="sm:hidden">🗑️</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Summary */}
              <div className="mt-4 text-right">
                <p className="text-gray-400 text-sm">
                  รวมทั้งหมด {getFilteredHistory().length} รายการ | 
                  ยอด OT รวม: ฿{getFilteredHistory().reduce((sum, entry) => sum + entry.totalOT, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-4">RPA & Automation</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• UiPath Studio & Orchestrator</li>
                <li>• Business Process Automation</li>
                <li>• Workflow Design</li>
                <li>• Process Mining</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-purple-400 mb-4">AI & Machine Learning</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Machine Learning Models</li>
                <li>• Natural Language Processing</li>
                <li>• AI Agent Development</li>
                <li>• Data Analysis & Visualization</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-green-400 mb-4">Web Development</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• React & JavaScript</li>
                <li>• Node.js & Express</li>
                <li>• API Development</li>
                <li>• Modern UI/UX Design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Ready to build intelligent automation solutions together? Let's discuss how my RPA expertise and AI development skills can help transform your business processes.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:your-email@example.com" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
              Send Me an Email
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all">
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
