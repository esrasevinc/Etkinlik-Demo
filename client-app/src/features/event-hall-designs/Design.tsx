import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router";
import { Seat } from "../../models/seat";
import axios from "axios";
import { router } from "../../routes/Routes";
import { store } from "../../stores/store";

const Design = () => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [form] = Form.useForm();
  const [rows, setRows] = useState<number>(10); 
  const [columns, setColumns] = useState<number>(10); 
  const [hallName, setHallName] = useState<string>(""); 
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";

  useEffect(() => {
    const fetchEventHall = async (eventHallId: string) => {
      try {
        const response = await axios.get(`/eventhalls/${eventHallId}`);
        const eventHall = response.data;
        setRows(eventHall.rows);
        setColumns(eventHall.columns);
        setHallName(eventHall.title); 
      } catch (error) {
        console.error('Salon bilgilerini yükleme hatası:', error);
      }
    };

    const fetchSeats = async (eventHallId: string) => {
      try {
        const response = await axios.get(`/seats/${eventHallId}`);
        const fetchedSeats = response.data;

        if (Array.isArray(fetchedSeats)) {
          setSeats(fetchedSeats.map(seat => ({
            ...seat,
            status: seat.status || "Boşluk"
          })));
        } else {
          console.error('Geçersiz koltuk verisi alındı:', fetchedSeats);
        }
      } catch (error) {
        console.error('Koltukları yükleme hatası:', error);
        setSeats([]);
      }
    };

    fetchEventHall(id);
    fetchSeats(id);
  }, [id]);

  const handleSeatClick = (row: number, column: number) => {
    const existingSeat = seats.find(seat => seat.row === row && seat.column === column);

    if (existingSeat) {
      if (existingSeat.status === "Koltuk") {
        const updatedSeats = seats.map(seat =>
          seat.row === row && seat.column === column
            ? { ...seat, label: "", status: "Boşluk" }
            : seat
        );
        setSeats(updatedSeats);
        setSelectedSeat(null); 
        form.resetFields();
      } else {
        setSelectedSeat(existingSeat);
        form.setFieldsValue(existingSeat);
      }
    } else {
      const newSeat = {
        id: '',
        eventHallId: id,
        row,
        column,
        label: "",
        status: "Boşluk",
      };
      setSelectedSeat(newSeat);
      form.setFieldsValue(newSeat);
    }
  };

  const onFinish = async (values: Seat) => {
    const existingSeatIndex = seats.findIndex(seat => seat.row === values.row && seat.column === values.column);

    const updatedSeats = [...seats];
    if (existingSeatIndex > -1) {
      updatedSeats[existingSeatIndex] = { ...values, status: "Koltuk" };
    } else {
      updatedSeats.push({ ...values, status: "Koltuk" }); 
    }

    setSeats(updatedSeats);
    setSelectedSeat(null);
    form.resetFields();

    try {
      await axios.post('/seats/save', {
        eventHallId: id,
        seats: updatedSeats.map(seat => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status
        }))
      });
      //store.notificationStore.openNotification("success", "Koltuk başarıyla güncellendi!", "");
    } catch (error) {
      console.error('Koltuk güncelleme hatası:', error);
    }
  };

  const saveLayout = async () => {
    try {
      await axios.post('/seats/save', {
        eventHallId: id,
        seats: seats.map(seat => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status
        }))
      });
      store.notificationStore.openNotification("success", "Salon düzeni başarıyla kaydedildi!", "");
      router.navigate("/salon-tasarimlari");
    } catch (error) {
      console.error('Koltuk düzeni kaydetme hatası:', error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
        <h2 style={{ fontSize: "18px" }}>{hallName} Koltuk Düzeni</h2> 
        <Button type="primary" onClick={saveLayout} size="large"  
          style={{
            padding: "10px 20px",  
            fontSize: "18px",  
            height: "50px", 
          }}>
          Düzeni Kaydet
        </Button>
      </div>

      {selectedSeat && (
        <Form form={form} onFinish={onFinish} layout="inline" style={{ marginBottom: 20 }}>
          <Form.Item name="row">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="column">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Koltuk Adı"
            name="label" 
            rules={[{ required: true, message: "Koltuk adı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Ekle
            </Button>
          </Form.Item>
        </Form>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "5px",
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, columnIndex) => {
            const seat = seats.find(seat => seat.row === rowIndex && seat.column === columnIndex);

            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                style={{
                  width: "100%",
                  height: "0",
                  paddingBottom: "100%",
                  border: "0.5px solid lightgray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: seat?.status === "Koltuk"
                    ? "lightgreen"
                    : (selectedSeat?.row === rowIndex && selectedSeat?.column === columnIndex ? "lightblue" : "white"),
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => handleSeatClick(rowIndex, columnIndex)}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  {seat?.label || ""}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {seats.length > 0 ? (
          <ul>
            {seats.map((seat, index) =>
              seat.status === "Koltuk" && (
                <li key={index}>
                  {`Koltuk: ${seat.label}, Satır: ${(seat.row) + 1}, Sütun: ${(seat.column) + 1}`}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>Henüz koltuk seçilmedi.</p>
        )}
      </div>
    </div>
  );
};

export default observer(Design);
