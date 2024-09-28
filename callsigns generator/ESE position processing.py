def process_text(input_file, output_file):
    # Markers to search for
    markers = ["DEL", "GND", "TWR", "APP", "CTR"]

    # Open input and output files
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        # Read each line in the input file
        for line in infile:
            # Skip lines containing "ATIS"
            if "ATIS" in line:
                continue
            # Check for any marker in the line
            for marker in markers:
                # If a marker is found, truncate the line after it
                if f":{marker}:" in line:
                    line = line.split(f":{marker}:")[0] + f":{marker}:\n"
                    break
            # Write the processed line to the output file
            outfile.write(line)

# Example usage
input_file = "ese.txt"
output_file = "callsigns.txt"
process_text(input_file, output_file)
