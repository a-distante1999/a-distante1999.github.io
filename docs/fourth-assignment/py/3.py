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
    with open('3.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerow(['yr', 'month', 'day', 'min', 'max'])

        for year in years:
            for i in range(12):
                d = 0
                for row in data:
                    if row[0].split(".")[2] == year and int(row[0].split(".")[1]) == i+1:
                        d += 1

                        writer.writerow([year, i+1, d, float(row[2]), float(row[3])])
                        print([year, i+1, d, float(row[2]), float(row[3])])

data = get_data()
data = get_years(data)
data = refactor_data(data)

