import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] text-zinc-200 flex items-center justify-center p-6">
          <div className="panel max-w-md w-full">
            <h1 className="font-display text-lg text-gold mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-sm text-red-300 mb-4">{this.state.error.message}</p>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => window.location.reload()}
            >
              รีเฟรชหน้า
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
