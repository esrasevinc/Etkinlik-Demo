import { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
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

  const [isBalconyModalVisible, setIsBalconyModalVisible] = useState(false);
  const [balconyRows, setBalconyRows] = useState<number>(0);
  const [balconyColumns, setBalconyColumns] = useState<number>(0);

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
        console.error("Salon bilgilerini yükleme hatası:", error);
      }
    };

    const fetchSeats = async (eventHallId: string) => {
      try {
        const response = await axios.get(`/seats/${eventHallId}`);
        const fetchedSeats = response.data;
    
        if (Array.isArray(fetchedSeats)) {
          const updatedSeats = fetchedSeats.map((seat) => ({
            ...seat,
            status: seat.status || "Boşluk",
          }));
    
          setSeats(updatedSeats);
    
          // Update the rows and columns based on the fetched seats
          const maxRow = Math.max(...updatedSeats.map(seat => seat.row), 0) + 1; // Add 1 to include zero-based index
          const maxColumn = Math.max(...updatedSeats.map(seat => seat.column), 0) + 1; // Add 1 to include zero-based index
          setRows(maxRow);
          setColumns(maxColumn);
        } else {
          console.error("Geçersiz koltuk verisi alındı:", fetchedSeats);
        }
      } catch (error) {
        console.error("Koltukları yükleme hatası:", error);
        setSeats([]);
      }
    };
    

    fetchEventHall(id);
    fetchSeats(id);
  }, [id]);

  const handleSeatClick = (row: number, column: number) => {
    const existingSeat = seats.find((seat) => seat.row === row && seat.column === column);

    if (existingSeat) {
      if (existingSeat.status === "Koltuk") {
        const updatedSeats = seats.map((seat) =>
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
        id: "",
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
    const existingSeatIndex = seats.findIndex((seat) => seat.row === values.row && seat.column === values.column);

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
      await axios.post("/seats/save", {
        eventHallId: id,
        seats: updatedSeats.map((seat) => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status,
        })),
      });
    } catch (error) {
      console.error("Koltuk güncelleme hatası:", error);
    }
  };

  const saveLayout = async () => {
    try {
      await axios.post("/seats/save", {
        eventHallId: id,
        seats: seats.map((seat) => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status,
        })),
      });
      store.notificationStore.openNotification("success", "Salon düzeni başarıyla kaydedildi!", "");
      router.navigate("/salon-tasarimlari");
    } catch (error) {
      console.error("Koltuk düzeni kaydetme hatası:", error);
    }
  };

  const handleAddBalcony = () => {
    setIsBalconyModalVisible(true);
  };

  const handleBalconySubmit = async () => {
    const newSeats = [...seats];
    for (let row = 0; row < balconyRows; row++) {
      for (let col = 0; col < balconyColumns; col++) {
        const newSeat = {
          id: "",
          eventHallId: id,
          row: rows + row,
          column: col,
          label: `B${row + 1}-${col + 1}`,
          status: "Koltuk",
        };
        newSeats.push(newSeat);
      }
    }
  
    setSeats(newSeats);
    setRows((prev) => prev + balconyRows);
    setColumns(Math.max(columns, balconyColumns));
    setIsBalconyModalVisible(false);
  
    // Verileri güncelle
    try {
      await axios.post("/seats/save", {
        eventHallId: id,
        seats: newSeats.map((seat) => ({
          row: seat.row,
          column: seat.column,
          label: seat.label,
          status: seat.status,
        })),
      });
    } catch (error) {
      console.error("Balkon koltuklarını kaydetme hatası:", error);
    }
  };
  

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "18px" }}>{hallName} Koltuk Düzeni</h2>
        <div>
          <Button type="primary" onClick={handleAddBalcony} size="large" style={{ marginRight: 10 }}>
            Balkon Ekle
          </Button>
          <Button type="primary" onClick={saveLayout} size="large">
            Düzeni Kaydet
          </Button>
        </div>
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
            const seat = seats.find((seat) => seat.row === rowIndex && seat.column === columnIndex);
            const isSelected = selectedSeat?.row === rowIndex && selectedSeat?.column === columnIndex; // Seçili koltuk kontrolü
            const isBalconySeat = rowIndex >= rows; // Check if the seat is in the balcony section

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
                  backgroundColor: isSelected ? "lightblue" : (seat?.status === "Koltuk" ? (isBalconySeat ? "lightcoral" : "lightgreen") : "white"), // Distinguish balcony seats with a different color
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

      <Modal
        title="Balkon Ekle"
        visible={isBalconyModalVisible}
        onOk={handleBalconySubmit}
        onCancel={() => setIsBalconyModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Balkon Satırı" required>
            <Input
              type="number"
              min={1}
              value={balconyRows}
              onChange={(e) => setBalconyRows(parseInt(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Balkon Sütunu" required>
            <Input
              type="number"
              min={1}
              value={balconyColumns}
              onChange={(e) => setBalconyColumns(parseInt(e.target.value))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default observer(Design);
