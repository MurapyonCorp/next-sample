import { render, screen, RenderResult, fireEvent, act } from '@testing-library/react'
import { DelayInput } from './index'

// DelayInputコンポーネントに関するテスト
describe('DelayInput', () => {
  let renderResult: RenderResult
  let handleChange: jest.Mock

  beforeEach(() => {

    // タイマーをjestのものに置き換える
    jest.useFakeTimers()

    // モック関数を作成する
    handleChange = jest.fn()

    // モック関数をDelayButtonに渡して描画
    renderResult = render(<DelayInput onChange={handleChange}/>)
  })

  afterEach(() => {
    renderResult.unmount()

    // タイマーを元のものに戻す
    jest.useFakeTimers()
  })

  // span要素のテキストが空であることをテスト
  it('should display empty in span on initial render', () => {
    const spanNode = screen.getByTestId('display-text') as HTMLSpanElement
    
    // 初期表示は空
    expect(spanNode).toHaveTextContent('入力したテキスト:')
  })

  // 入力直後はspan要素が「入力中...」と表示するかテスト
  it('should display 「入力中...」 immediately after onChange event occurs', () => {
    const inputText = 'Test Input Text'
    const inputNode = screen.getByTestId('input-text') as HTMLInputElement

    // inputのonChangeイベントを呼び出す
    fireEvent.change(inputNode, {target: {value: inputText}})

    const spanNode = screen.getByTestId('display-text') as HTMLSpanElement

    // 入力中と表示するか確認
    expect(spanNode).toHaveTextContent('入力中...')
  })

  // 入力して1秒後にテキストが表示されるかテスト
  it('should display input text 1 second after onChange event occurs', async () => {
    const inputText = 'Test Input Text'
    const inputNode = screen.getByTestId('input-text') as HTMLInputElement

    // inputのonChangeイベントを呼び出す
    fireEvent.change(inputNode, {target: {value: inputText}})

    // act関数内で実行することにより、タイマーのコールバック中で起きる状態変更が反映されることを保証する
    await act(() => {
      // タイマーにセットされたtimeoutを全て実行する
      jest.runAllTimers()
    })

    const spanNode = screen.getByTestId('display-text') as HTMLSpanElement

    // 入力したテキストが表示されるか確認
    expect(spanNode).toHaveTextContent(`入力したテキスト: ${inputText}`)

    // モック関数を渡し、呼ばれたか確認する
    expect(handleChange).toHaveBeenCalled()
  })
})