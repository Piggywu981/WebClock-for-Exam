import sys
import json
import csv
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QTableWidget, QTableWidgetItem, QVBoxLayout, QWidget,
    QPushButton, QFileDialog, QLabel, QLineEdit, QDateEdit, QTimeEdit, QHBoxLayout,
    QFormLayout, QMessageBox, QDialog
)
from PyQt5.QtCore import Qt, QDate, QTime

class JsonEditor(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("JSON 文件编辑器")
        self.setGeometry(100, 100, 800, 600)

        # 创建中心窗口
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout(self.central_widget)

        # 创建表格控件
        self.table_widget = QTableWidget()
        self.table_widget.setColumnCount(5)
        self.table_widget.setHorizontalHeaderLabels(["日期", "科目", "开始时间", "结束时间", "操作"])
        self.layout.addWidget(self.table_widget)

        # 创建按钮
        self.load_button = QPushButton("加载 JSON 文件")
        self.load_button.clicked.connect(self.load_json)
        self.layout.addWidget(self.load_button)

        self.load_csv_button = QPushButton("加载 CSV 文件")
        self.load_csv_button.clicked.connect(self.load_csv)
        self.layout.addWidget(self.load_csv_button)

        self.add_subject_button = QPushButton("添加科目")
        self.add_subject_button.clicked.connect(self.add_subject)
        self.layout.addWidget(self.add_subject_button)

        self.save_button = QPushButton("保存修改")
        self.save_button.clicked.connect(self.save_json)
        self.layout.addWidget(self.save_button)

        self.export_csv_button = QPushButton("导出为 CSV")
        self.export_csv_button.clicked.connect(self.export_csv)
        self.layout.addWidget(self.export_csv_button)

        # 用于存储 JSON 数据
        self.data = {"schedule": []}  # 初始化为空的 schedule 列表

    def load_json(self):
        """加载 JSON 文件"""
        file_path, _ = QFileDialog.getOpenFileName(self, "选择 JSON 文件", "config", "JSON 文件 (*.json)")
        if file_path:
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    self.data = json.load(file)
                self.display_data()
            except json.JSONDecodeError as e:
                QMessageBox.warning(self, "加载失败", f"JSON 文件格式错误：{e}")
            except Exception as e:
                QMessageBox.warning(self, "加载失败", f"加载文件时出错：{e}")

    def load_csv(self):
        """加载 CSV 文件并转换为 JSON 格式"""
        file_path, _ = QFileDialog.getOpenFileName(self, "选择 CSV 文件", "config", "CSV 文件 (*.csv)")
        if file_path:
            try:
                self.data = {"schedule": []}
                with open(file_path, newline='', encoding='utf-8') as csvfile:
                    reader = csv.DictReader(csvfile)
                    for row in reader:
                        date = row.get("date", "")
                        subject = row.get("subject", "")
                        start_time = row.get("start_time", "")
                        end_time = row.get("end_time", "")

                        # 检查日期是否已存在
                        existing_day = next((day for day in self.data["schedule"] if day["date"] == date), None)
                        if existing_day is None:
                            existing_day = {"date": date, "subject": []}
                            self.data["schedule"].append(existing_day)

                        existing_day["subject"].append({
                            "sub": subject,
                            "starttime": start_time,
                            "endtime": end_time
                        })

                self.display_data()
            except Exception as e:
                QMessageBox.warning(self, "加载失败", f"CSV 文件格式错误或加载失败：{e}")

    def display_data(self):
        """在表格中显示 JSON 数据"""
        if self.data and "schedule" in self.data:
            self.table_widget.setRowCount(0)  # 清空表格
            row_index = 0
            for day in self.data["schedule"]:
                for subject in day["subject"]:
                    self.table_widget.insertRow(row_index)
                    date_item = QTableWidgetItem(day["date"])
                    sub_item = QTableWidgetItem(subject["sub"])
                    start_time_item = QTableWidgetItem(subject["starttime"])
                    end_time_item = QTableWidgetItem(subject["endtime"])

                    edit_button = QPushButton("编辑")
                    edit_button.clicked.connect(lambda checked, row=row_index: self.edit_subject(row))

                    self.table_widget.setItem(row_index, 0, date_item)
                    self.table_widget.setItem(row_index, 1, sub_item)
                    self.table_widget.setItem(row_index, 2, start_time_item)
                    self.table_widget.setItem(row_index, 3, end_time_item)
                    self.table_widget.setCellWidget(row_index, 4, edit_button)

                    row_index += 1

    def add_subject(self):
        """添加科目信息"""
        self.add_window = QDialog(self)
        self.add_window.setWindowTitle("添加科目信息")
        self.add_window.setGeometry(300, 300, 400, 200)

        layout = QFormLayout()

        date_label = QLabel("日期")
        date_edit = QDateEdit(QDate.currentDate())
        date_edit.setCalendarPopup(True)
        layout.addRow(date_label, date_edit)

        sub_label = QLabel("科目")
        sub_edit = QLineEdit()
        layout.addRow(sub_label, sub_edit)

        start_time_label = QLabel("开始时间")
        start_time_edit = QTimeEdit(QTime.currentTime())
        layout.addRow(start_time_label, start_time_edit)

        end_time_label = QLabel("结束时间")
        end_time_edit = QTimeEdit(QTime.currentTime().addSecs(3600))  # 默认1小时后
        layout.addRow(end_time_label, end_time_edit)

        save_button = QPushButton("保存")
        save_button.clicked.connect(lambda: self.save_new_subject(date_edit, sub_edit, start_time_edit, end_time_edit))
        layout.addWidget(save_button)

        self.add_window.setLayout(layout)
        self.add_window.show()

    def save_new_subject(self, date_edit, sub_edit, start_time_edit, end_time_edit):
        """保存新添加的科目信息"""
        new_date = date_edit.text()
        new_sub = sub_edit.text()
        new_start_time = start_time_edit.text()
        new_end_time = end_time_edit.text()

        # 检查日期是否已存在
        existing_day = next((day for day in self.data["schedule"] if day["date"] == new_date), None)
        if existing_day is None:
            existing_day = {"date": new_date, "subject": []}
            self.data["schedule"].append(existing_day)

        existing_day["subject"].append({
            "sub": new_sub,
            "starttime": new_start_time,
            "endtime": new_end_time
        })

        # 更新表格显示
        row_index = self.table_widget.rowCount()
        self.table_widget.insertRow(row_index)
        self.table_widget.setItem(row_index, 0, QTableWidgetItem(new_date))
        self.table_widget.setItem(row_index, 1, QTableWidgetItem(new_sub))
        self.table_widget.setItem(row_index, 2, QTableWidgetItem(new_start_time))
        self.table_widget.setItem(row_index, 3, QTableWidgetItem(new_end_time))

        # 添加编辑按钮
        edit_button = QPushButton("编辑")
        edit_button.clicked.connect(lambda checked, row=row_index: self.edit_subject(row))
        self.table_widget.setCellWidget(row_index, 4, edit_button)

        self.add_window.close()

    def edit_subject(self, row):
        """编辑科目信息"""
        date = self.table_widget.item(row, 0).text()
        sub = self.table_widget.item(row, 1).text()
        start_time = self.table_widget.item(row, 2).text()
        end_time = self.table_widget.item(row, 3).text()

        # 创建编辑窗口
        self.edit_window = QDialog(self)
        self.edit_window.setWindowTitle("编辑科目信息")
        self.edit_window.setGeometry(300, 300, 400, 200)

        layout = QFormLayout()

        date_label = QLabel("日期")
        date_edit = QDateEdit(QDate.fromString(date, "yyyy/M/d"))
        date_edit.setCalendarPopup(True)
        layout.addRow(date_label, date_edit)

        sub_label = QLabel("科目")
        sub_edit = QLineEdit(sub)
        layout.addRow(sub_label, sub_edit)

        start_time_label = QLabel("开始时间")
        start_time_edit = QTimeEdit(QTime.fromString(start_time, "hh:mm"))
        layout.addRow(start_time_label, start_time_edit)

        end_time_label = QLabel("结束时间")
        end_time_edit = QTimeEdit(QTime.fromString(end_time, "hh:mm"))
        layout.addRow(end_time_label, end_time_edit)

        save_button = QPushButton("保存")
        save_button.clicked.connect(lambda: self.save_edited_subject(row, date_edit, sub_edit, start_time_edit, end_time_edit))
        layout.addWidget(save_button)

        self.edit_window.setLayout(layout)
        self.edit_window.show()

    def save_edited_subject(self, row, date_edit, sub_edit, start_time_edit, end_time_edit):
        """保存编辑后的科目信息"""
        new_date = date_edit.text()
        new_sub = sub_edit.text()
        new_start_time = start_time_edit.text()
        new_end_time = end_time_edit.text()

        # 更新数据
        for day in self.data["schedule"]:
            if day["date"] == self.table_widget.item(row, 0).text():
                for subject in day["subject"]:
                    if subject["sub"] == self.table_widget.item(row, 1).text():
                        subject["sub"] = new_sub
                        subject["starttime"] = new_start_time
                        subject["endtime"] = new_end_time
                        break
                break

        # 更新表格显示
        self.table_widget.item(row, 0).setText(new_date)
        self.table_widget.item(row, 1).setText(new_sub)
        self.table_widget.item(row, 2).setText(new_start_time)
        self.table_widget.item(row, 3).setText(new_end_time)

        self.edit_window.close()

    def save_json(self):
        """保存修改后的 JSON 数据"""
        if self.data and "schedule" in self.data:
            file_path, _ = QFileDialog.getSaveFileName(self, "保存 JSON 文件", "config/subjectlist", "JSON 文件 (*.json)")
            if file_path:
                with open(file_path, "w", encoding="utf-8") as file:
                    json.dump(self.data, file, ensure_ascii=False, indent=4)
                QMessageBox.information(self, "保存成功", "JSON 文件已成功保存！")
        else:
            QMessageBox.warning(self, "警告", "没有加载任何数据！")

    def export_csv(self):
        """导出为 CSV 文件"""
        if self.data and "schedule" in self.data:
            file_path, _ = QFileDialog.getSaveFileName(self, "保存 CSV 文件", "config/subjectlist", "CSV 文件 (*.csv)")
            if file_path:
                with open(file_path, "w", newline='', encoding='utf-8') as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow(["date", "subject", "start_time", "end_time"])
                    for day in self.data["schedule"]:
                        for subject in day["subject"]:
                            writer.writerow([day["date"], subject["sub"], subject["starttime"], subject["endtime"]])
                QMessageBox.information(self, "导出成功", "CSV 文件已成功导出！")
        else:
            QMessageBox.warning(self, "警告", "没有加载任何数据！")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = JsonEditor()
    window.show()
    sys.exit(app.exec_())