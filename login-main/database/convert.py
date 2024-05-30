import csv

# File paths
csv_file_path = 'data.csv'
sql_file_path = 'data.sql'

# Table name
table_name = 'usuarios'

# Open the CSV file and the SQL file
with open(csv_file_path, mode='r', encoding='utf-8') as csv_file, open(sql_file_path, mode='w', encoding='utf-8') as sql_file:
    # Create a CSV reader
    csv_reader = csv.reader(csv_file)
    
    # Get the header
    header = next(csv_reader)
    
    # Write the SQL file header
    sql_file.write(f"INSERT INTO {table_name} ({', '.join(header)}) VALUES\n")
    
    # Process each row
    for row in csv_reader:
        # Format the values for SQL
        values = ', '.join(f"'{value}'" for value in row)
        sql_file.write(f"({values}),\n")
    
    # Remove the last comma and add a semicolon
    sql_file.seek(sql_file.tell() - 2, 0)  # Go back two characters
    sql_file.write(";\n")

print("Conversion complete!")
