import React, { useCallback, useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import "@/app/slider.css"

const MultiRangeSlider = ({ min, max, onChange }) => {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef(min)
  const maxValRef = useRef(max)
  const range = useRef(null)

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  useEffect(() => {
    onChange({ min: minVal, max: maxVal })
  }, [minVal, maxVal, onChange])

  return (
    <div className="flex items-center justify-center">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="absolute h-0 w-full outline-none pointer-events-none thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="absolute h-0 w-full outline-none pointer-events-none thumb thumb--right"
      />

      <div className="relative w-[150px]">
         <div className="absolute w-full h-1 rounded-md bg-gray-300 z-1" />
         <div ref={range} className="absolute h-1 rounded-md bg-white z-2" />
         <div className="absolute left-1 text-size-1 mt-5 text-white">
            ${minVal}
         </div>
         <div className="absolute right-0 text-size-1 mt-5 text-white">
            ${maxVal}
         </div>
      </div>
    </div>
  )
}

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default MultiRangeSlider
