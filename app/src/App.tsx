import { useState, useRef, useEffect } from 'react'
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  Check, 
  Lightbulb,
  TrendingUp,
  Target,
  RefreshCw,
  Hash,
  Image,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { analyzeNote, needsMoreInfo, type AnalysisResult } from '@/utils/analyzer'
import './App.css'

function App() {
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [product, setProduct] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showSupplement, setShowSupplement] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const analysisSteps = [
    '正在分析笔记结构...',
    '正在识别关键信息...',
    '正在生成优化建议...',
    '正在创建标题和标签...'
  ]

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisStep(prev => {
          if (prev >= analysisSteps.length - 1) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 600)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const handleAnalyze = async () => {
    if (needsMoreInfo(content)) {
      setShowSupplement(true)
      return
    }
    
    setIsAnalyzing(true)
    setAnalysisStep(0)
    setResult(null)
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const analysisResult = analyzeNote(content, topic || undefined, audience || undefined, product || undefined)
    setResult(analysisResult)
    setIsAnalyzing(false)
    
    // 滚动到结果区域
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleReset = () => {
    setContent('')
    setTopic('')
    setAudience('')
    setProduct('')
    setResult(null)
    setShowSupplement(false)
    setAnalysisStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF2442] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-[#333333]">小红书优化工具</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">功能</a>
              <a href="#howto" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">使用方法</a>
              <a href="#about" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">关于</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主视觉区 */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF2442]/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F5F5F5] rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF2442]/10 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[#FF2442]" />
            <span className="text-sm text-[#FF2442] font-medium">AI 智能分析</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight animate-fade-in-up stagger-1">
            小红书笔记
            <br />
            <span className="text-[#FF2442]">智能优化工具</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#666666] mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-2">
            输入笔记正文，AI一键生成结构评分、修改建议、爆款标题与精准标签
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Button 
              size="lg" 
              className="bg-[#FF2442] hover:bg-[#E01A35] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#FF2442]/25 hover:shadow-xl hover:shadow-[#FF2442]/30 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              立即体验
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#E5E5E5] text-[#666666] hover:bg-[#F5F5F5] px-8 py-6 text-lg rounded-xl"
              onClick={() => {
                setContent('姐妹们，这款面膜真的绝了！\n\n用了整整一个月，皮肤状态明显改善。特别是熬夜后敷一片，第二天完全看不出疲惫感。\n\n精华超级多，敷完脸还能敷脖子，性价比真的高。\n\n你们还有什么好用的面膜推荐吗？评论区告诉我！')
                document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              查看示例
            </Button>
          </div>
        </div>
      </section>

      {/* 输入区 */}
      <section id="input-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 输入卡片 */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-[#333333] flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#FF2442]/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#FF2442]" />
                    </span>
                    粘贴你的笔记正文
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在这里粘贴你的小红书笔记正文..."
                    className="min-h-[280px] resize-none border-[#E5E5E5] focus:border-[#FF2442] focus:ring-[#FF2442]/20 rounded-xl text-[#333333] placeholder:text-[#999999] text-base leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm ${content.length < 80 ? 'text-[#FF2442]' : 'text-[#999999]'}`}>
                      {content.length} 字
                      {content.length < 80 && '（建议至少80字）'}
                    </span>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!content.trim() || isAnalyzing}
                      className="bg-[#FF2442] hover:bg-[#E01A35] text-white px-6 py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          生成优化建议
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 提示面板 */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg bg-white rounded-2xl h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#333333] flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#FF9800]" />
                    提示
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-sm text-[#666666]">
                      <span className="w-5 h-5 bg-[#FF2442]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-[#FF2442] font-medium">1</span>
                      </span>
                      正文至少80字，AI才能准确分析
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#666666]">
                      <span className="w-5 h-5 bg-[#FF2442]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-[#FF2442] font-medium">2</span>
                      </span>
                      包含具体产品名或结论效果更佳
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#666666]">
                      <span className="w-5 h-5 bg-[#FF2442]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-[#FF2442] font-medium">3</span>
                      </span>
                      分段清晰的笔记更容易获得高分
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 补充信息表单 */}
          {showSupplement && !result && (
            <Card className="mt-6 border-0 shadow-lg bg-white rounded-2xl animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#333333] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#FF9800]" />
                  补充信息（可选）
                </CardTitle>
                <p className="text-sm text-[#666666]">内容较短，补充以下信息可获得更精准的分析结果</p>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">主题/话题</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="例如：护肤、穿搭、美食"
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:border-[#FF2442] focus:ring-2 focus:ring-[#FF2442]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">目标受众</label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="例如：新手、学生党、职场人"
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:border-[#FF2442] focus:ring-2 focus:ring-[#FF2442]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">产品或结论</label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="例如：某品牌面膜、有效方法"
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:border-[#FF2442] focus:ring-2 focus:ring-[#FF2442]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-[#FF2442] hover:bg-[#E01A35] text-white px-6 py-5 rounded-xl"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        继续分析
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 加载状态 */}
      {isAnalyzing && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-[#F5F5F5] rounded-full" />
                <div className="absolute inset-0 border-4 border-[#FF2442] rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#FF2442]" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                    index === analysisStep 
                      ? 'bg-[#FF2442]/10 text-[#FF2442]' 
                      : index < analysisStep 
                        ? 'bg-[#00C853]/10 text-[#00C853]' 
                        : 'bg-[#F5F5F5] text-[#999999]'
                  }`}
                >
                  {index < analysisStep ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : index === analysisStep ? (
                    <RefreshCw className="w-5 h-5 flex-shrink-0 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 结果区 */}
      {result && !isAnalyzing && (
        <section ref={resultRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* 操作栏 */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#333333]">分析结果</h2>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-[#E5E5E5] text-[#666666] hover:bg-[#F5F5F5]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新分析
              </Button>
            </div>

            {/* 结构评分 */}
            <div className="grid lg:grid-cols-4 gap-6">
              {/* 评分圆环 */}
              <Card className="lg:col-span-1 border-0 shadow-lg bg-white rounded-2xl">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#F5F5F5"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#FF2442"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.score / 100) * 283} 283`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-[#333333]">{result.score}</span>
                      <span className="text-sm text-[#999999]">分</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge className={`${
                      result.score >= 80 ? 'bg-[#00C853]' : 
                      result.score >= 60 ? 'bg-[#FF9800]' : 'bg-[#FF2442]'
                    } text-white`}>
                      {result.scoreLabel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 问题卡片 */}
              <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
                {result.issues.map((issue, index) => (
                  <Card 
                    key={index} 
                    className="border-0 shadow-md bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#FF2442]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-4 h-4 text-[#FF2442]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#333333] mb-2">{issue.title}</h4>
                          <p className="text-sm text-[#666666]">{issue.suggestion}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 修改建议 */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#333333] flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#FF2442]" />
                  修改建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="beginning" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 bg-[#F5F5F5] p-1 rounded-xl mb-6">
                    <TabsTrigger 
                      value="beginning" 
                      className="rounded-lg data-[state=active]:bg-[#FF2442] data-[state=active]:text-white transition-all"
                    >
                      开头
                    </TabsTrigger>
                    <TabsTrigger 
                      value="middle"
                      className="rounded-lg data-[state=active]:bg-[#FF2442] data-[state=active]:text-white transition-all"
                    >
                      中段
                    </TabsTrigger>
                    <TabsTrigger 
                      value="end"
                      className="rounded-lg data-[state=active]:bg-[#FF2442] data-[state=active]:text-white transition-all"
                    >
                      结尾
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="beginning" className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F5F5F5] rounded-xl">
                        <span className="text-xs text-[#999999] mb-2 block">原标题</span>
                        <p className="text-[#666666]">{result.modifications.beginning.original}</p>
                      </div>
                      <div className="p-4 bg-[#FF2442]/5 border border-[#FF2442]/20 rounded-xl relative">
                        <span className="text-xs text-[#FF2442] mb-2 block">优化版本</span>
                        <p className="text-[#333333] font-medium">{result.modifications.beginning.optimized}</p>
                        <button
                          onClick={() => handleCopy(result.modifications.beginning.optimized, 'beginning')}
                          className="absolute top-4 right-4 p-2 hover:bg-[#FF2442]/10 rounded-lg transition-colors"
                        >
                          {copiedIndex === 'beginning' ? (
                            <Check className="w-4 h-4 text-[#00C853]" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#FF2442]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="middle" className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F5F5F5] rounded-xl">
                        <span className="text-xs text-[#999999] mb-2 block">原标题</span>
                        <p className="text-[#666666]">{result.modifications.middle.original}</p>
                      </div>
                      <div className="p-4 bg-[#FF2442]/5 border border-[#FF2442]/20 rounded-xl relative">
                        <span className="text-xs text-[#FF2442] mb-2 block">优化版本</span>
                        <p className="text-[#333333] font-medium">{result.modifications.middle.optimized}</p>
                        <button
                          onClick={() => handleCopy(result.modifications.middle.optimized, 'middle')}
                          className="absolute top-4 right-4 p-2 hover:bg-[#FF2442]/10 rounded-lg transition-colors"
                        >
                          {copiedIndex === 'middle' ? (
                            <Check className="w-4 h-4 text-[#00C853]" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#FF2442]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="end" className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F5F5F5] rounded-xl">
                        <span className="text-xs text-[#999999] mb-2 block">原标题</span>
                        <p className="text-[#666666]">{result.modifications.end.original}</p>
                      </div>
                      <div className="p-4 bg-[#FF2442]/5 border border-[#FF2442]/20 rounded-xl relative">
                        <span className="text-xs text-[#FF2442] mb-2 block">优化版本</span>
                        <p className="text-[#333333] font-medium">{result.modifications.end.optimized}</p>
                        <button
                          onClick={() => handleCopy(result.modifications.end.optimized, 'end')}
                          className="absolute top-4 right-4 p-2 hover:bg-[#FF2442]/10 rounded-lg transition-colors"
                        >
                          {copiedIndex === 'end' ? (
                            <Check className="w-4 h-4 text-[#00C853]" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#FF2442]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 生成的标题 */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#333333] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF2442]" />
                  生成的标题
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  {/* 热门推荐 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#999999] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FF2442] rounded-full" />
                      热门推荐
                    </h4>
                    <div className="space-y-2">
                      {result.titles.hot.map((title, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 bg-[#F5F5F5] hover:bg-[#FF2442]/5 hover:border-[#FF2442]/20 border border-transparent rounded-xl transition-all cursor-pointer"
                          onClick={() => handleCopy(title, `hot-${index}`)}
                        >
                          <span className="text-sm text-[#333333] truncate pr-2">{title}</span>
                          {copiedIndex === `hot-${index}` ? (
                            <Check className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#999999] group-hover:text-[#FF2442] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 痛点型 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#999999] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FF9800] rounded-full" />
                      痛点型
                    </h4>
                    <div className="space-y-2">
                      {result.titles.painPoint.map((title, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 bg-[#F5F5F5] hover:bg-[#FF9800]/5 hover:border-[#FF9800]/20 border border-transparent rounded-xl transition-all cursor-pointer"
                          onClick={() => handleCopy(title, `pain-${index}`)}
                        >
                          <span className="text-sm text-[#333333] truncate pr-2">{title}</span>
                          {copiedIndex === `pain-${index}` ? (
                            <Check className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#999999] group-hover:text-[#FF9800] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 好奇型 */}
                  <div>
                    <h4 className="text-sm font-medium text-[#999999] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#00C853] rounded-full" />
                      好奇型
                    </h4>
                    <div className="space-y-2">
                      {result.titles.curiosity.map((title, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 bg-[#F5F5F5] hover:bg-[#00C853]/5 hover:border-[#00C853]/20 border border-transparent rounded-xl transition-all cursor-pointer"
                          onClick={() => handleCopy(title, `curiosity-${index}`)}
                        >
                          <span className="text-sm text-[#333333] truncate pr-2">{title}</span>
                          {copiedIndex === `curiosity-${index}` ? (
                            <Check className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#999999] group-hover:text-[#00C853] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 标签与封面文案 */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* 标签 */}
              <Card className="lg:col-span-2 border-0 shadow-lg bg-white rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-[#333333] flex items-center gap-2">
                    <Hash className="w-5 h-5 text-[#FF2442]" />
                    推荐标签
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleCopy(`#${tag}`, `tag-${index}`)}
                        className="group relative px-4 py-2 bg-[#F5F5F5] hover:bg-[#FF2442] text-[#666666] hover:text-white rounded-full text-sm transition-all duration-300 hover:-translate-y-0.5"
                      >
                        #{tag}
                        {copiedIndex === `tag-${index}` && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#00C853] text-white text-xs rounded whitespace-nowrap">
                            已复制
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 封面文案 */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#FF2442]/10 to-[#FF2442]/5 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-[#333333] flex items-center gap-2">
                    <Image className="w-5 h-5 text-[#FF2442]" />
                    封面文案
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative p-4 bg-white rounded-xl border border-[#FF2442]/20">
                    <p className="text-[#333333] font-medium">{result.coverText}</p>
                    <button
                      onClick={() => handleCopy(result.coverText, 'cover')}
                      className="absolute top-2 right-2 p-2 hover:bg-[#FF2442]/10 rounded-lg transition-colors"
                    >
                      {copiedIndex === 'cover' ? (
                        <Check className="w-4 h-4 text-[#00C853]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#FF2442]" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* 功能介绍 */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">功能特点</h2>
            <p className="text-[#666666]">专为小红书创作者打造的智能优化工具</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#FF2442]/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#FF2442]" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">结构评分</h3>
                <p className="text-sm text-[#666666]">基于小红书算法，精准评估笔记结构</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-[#FF9800]" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">修改建议</h3>
                <p className="text-sm text-[#666666]">分段优化，提供可直接替换的文案</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#00C853]/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#00C853]" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">爆款标题</h3>
                <p className="text-sm text-[#666666]">AI生成多类型标题，提升点击率</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2196F3]/10 rounded-xl flex items-center justify-center mb-4">
                  <Hash className="w-6 h-6 text-[#2196F3]" />
                </div>
                <h3 className="font-semibold text-[#333333] mb-2">精准标签</h3>
                <p className="text-sm text-[#666666]">智能推荐标签，增加曝光机会</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使用方法 */}
      <section id="howto" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">使用方法</h2>
            <p className="text-[#666666]">三步轻松优化你的小红书笔记</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#FF2442] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-[#333333] mb-2">粘贴笔记正文</h3>
                <p className="text-[#666666]">将你的小红书笔记内容粘贴到输入框中，建议至少80字以获得更准确的分析结果</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#FF2442] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-[#333333] mb-2">补充信息（可选）</h3>
                <p className="text-[#666666]">如果内容较短，可以补充主题、受众、产品等信息，帮助AI生成更精准的建议</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#FF2442] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-[#333333] mb-2">获取优化建议</h3>
                <p className="text-[#666666]">点击"生成优化建议"按钮，获取结构评分、修改建议、爆款标题和精准标签</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer id="about" className="py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5] border-t border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF2442] rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-[#666666]">© 2024 小红书优化工具. 保留所有权利.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">隐私政策</a>
            <a href="#" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">使用条款</a>
            <a href="#" className="text-sm text-[#666666] hover:text-[#FF2442] transition-colors">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
