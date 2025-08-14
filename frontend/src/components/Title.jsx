import React from 'react'
import styles from './Title.module.css'

const Title = ({ text }) => {
    return (
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 8px 0",
            letterSpacing: "-0.025em",
          }}
        >
          {text}
        </h1>

      </div>
    )
  }

export default Title;