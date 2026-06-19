import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("does not update before delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("hello");
  });

  it("updates after delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "hello" },
    });

    rerender({ value: "world" });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current).toBe("world");
  });

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    act(() => { jest.advanceTimersByTime(200); });

    rerender({ value: "abc" });
    act(() => { jest.advanceTimersByTime(200); });

    expect(result.current).toBe("a");

    act(() => { jest.advanceTimersByTime(400); });
    expect(result.current).toBe("abc");
  });
});
