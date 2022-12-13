import csv

years = ['1993', '1997', '2001', '2005', '2009', '2013', '2017', '2021']

def get_data():
    data = []
    with open("../temp.csv", newline='') as f:
        reader = csv.reader(f, skipinitialspace=False,delimiter=',', quoting=csv.QUOTE_NONE)
        for row in reader:
            data.append(list(filter(None, row)))
    return data[1:]


def get_years(data):
    final = []
    for row in data:
        if row[0].split(".")[2] in years:
            final.append(row)
    return final

def refactor_data(data):
    with open('1.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerow(['yr', 'month', 'max', 'min', 'avg'])

        for year in years:
            for i in range(12):
                ma = -100000
                mi = 100000
                s = 0
                c = 0
                for row in data:
                    if row[0].split(".")[2] == year and int(row[0].split(".")[1]) == i+1:
                        c += 2

                        if float(row[2]) > ma: ma = float(row[2])
                        if float(row[2]) < mi: mi = float(row[2])

                        if float(row[3]) > ma: ma = float(row[3])
                        if float(row[3]) < mi: mi = float(row[3])

                        s = s + float(row[2]) + float(row[3])
                writer.writerow([year, i+1, ma, mi, s/c])
                print([year, i+1, ma, mi, s/c])

data = get_data()
data = get_years(data)
data = refactor_data(data)

