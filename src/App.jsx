import { useState } from 'react'
import './index.css'

function App() {
  const [processInput, setProcessInput] = useState('')
  const [pythonCode, setPythonCode] = useState('')

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
