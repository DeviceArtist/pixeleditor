
import './App.css';
import { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Drawer, Tabs } from 'antd';


function App() {
  const [pixels, setPixels] = useState([]);
  const [code, setCode] = useState("");
  const [microPythonCode, setMicroPythonCode] = useState("");
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // 初始化像素网格
  const makePixels = (rows, cols) => {
    const arr = [];
    for (let i = 0; i < cols; i++) {
      const row = [];
      for (let j = 0; j < rows; j++) {
        row.push(0);
      }
      arr.push(row);
    }
    setPixels(arr);
  };

  // 切换像素状态
  const togglePixel = (rowIndex, colIndex) => {
    const newPixels = [...pixels];
    newPixels[rowIndex][colIndex] = newPixels[rowIndex][colIndex] === 0 ? 1 : 0;
    setPixels(newPixels);
  };

  const clear = () => {
    const newPixels = [...pixels];
    pixels.map((row, rowIndex) => {
      row.map((pixel, colIndex) => {
        newPixels[rowIndex][colIndex] = 0;
      });
    });
    setPixels(newPixels);
  }

  const updateCode = () => {
    let text = "[";
    text += "\r\n";
    pixels.map((row, rowIndex) => {
      text += "  [";
      row.map((pixel, colIndex) => {
        text += pixel;
        text += colIndex === row.length - 1 ? "" : ",";
      });
      text += "]";
      text += rowIndex === pixels.length - 1 ? "" : ","
      text += "\r\n";
    });
    text += "]"
    if (pixels.length !== 0) {
      form.setFieldValue("width", pixels[0].length);
      form.setFieldValue("height", pixels.length);
    }

    setCode(text);

    let t = `
from machine import Pin, I2C
import ssd1306
import framebuf
import time
i2c = I2C(sda=Pin(4), scl=Pin(5))
display = ssd1306.SSD1306_I2C(128, 32, i2c)

ICON = ${text}

display.fill(0)
#display.contrast(1)

def draw(ICON):
    for y, row in enumerate(ICON):
        for x, value in enumerate(row):
            display.pixel(x, y, value)


draw(ICON)
display.show()
`

    setMicroPythonCode(t)
  }

  useEffect(() => {
    updateCode();
  }, [pixels])

  useEffect(() => {
    form.setFieldsValue({ width: 8, height: 5 });
  }, [])

  return (
    <div className="app">
      <div className="cp">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          layout="inline"
          name="control-hooks"
          onFinish={({ width, height }) => {
            makePixels(width, height)
          }}
          style={{ width: "100%" }}
        >
          <Form.Item name="width" label="width" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="height" label="height" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              New
            </Button>
          </Form.Item>
        </Form>




        <Drawer
          title="Export"
          closable={{ 'aria-label': 'Close Button' }}
          onClose={() => { setOpen(false) }}
          open={open}
        >
          <Tabs defaultActiveKey="1" items={[
            {
              key: '1',
              label: 'Array Code',
              children: <textarea value={code} />,
            },
            {
              key: '2',
              label: 'microPython Code',
              children: <code><textarea value={microPythonCode} /></code>,
            }
          ]} onChange={() => { }} />
        </Drawer>

      </div>

      <div>
        <Space>
          <Button
            onClick={() => clear()}
            className="button"
          >
            clean
          </Button>
          <Button
            onClick={() => {
              setPixels([]);
            }}
            className="button"
          >
            delete
          </Button>
          <Button onClick={() => {
            setPixels([
              [1, 0, 1, 1, 1, 0, 1, 1, 1],
              [1, 0, 0, 0, 1, 0, 0, 0, 1],
              [1, 0, 1, 1, 1, 0, 1, 1, 1],
              [1, 0, 1, 0, 0, 0, 0, 0, 1],
              [1, 0, 1, 1, 1, 0, 1, 1, 1]
            ]);
          }}>123</Button>
          <Button type="primary" onClick={() => {
            setOpen(true);
          }}>
            export
          </Button>
        </Space>
      </div>

      <div className='editor'>
        {pixels.map((row, rowIndex) =>
          <div className='row'>
            {
              row.map((pixel, colIndex) => (
                <span
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => togglePixel(rowIndex, colIndex)}
                  className={`pixel ${pixel === 1 ? "black" : "white"
                    }`}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* {
        pixels.length != 0 && <pre className='code'>
          [
          <div className="code">
            {pixels.map((row, rowIndex) =>
              <div className='row'>
                [
                {
                  row.map((pixel, colIndex) => (
                    <span
                      key={`${rowIndex}-${colIndex}`}
                    >{pixel}{colIndex === row.length - 1 ? "" : ","}</span>
                  ))
                }]{rowIndex === pixels.length - 1 ? "" : ","}
              </div>
            )}
          </div>
          ]
        </pre>
      } */}

      {/* {
        pixels.length !== 0 && <div className='code'>{code}</div>
      } */}



    </div>
  );
}

export default App;
