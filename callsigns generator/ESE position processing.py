import sys
import os

def process_text(input_file, output_file, filter_letters):
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
            
            # Filter lines based on the initial two letters
            if line.startswith(filter_letters):
                outfile.write(line)

if __name__ == "__main__":
    # Check if the script is being run with a file argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        # Ensure the input file is an .ese file
        if input_file.endswith(".ese"):
            # Ask the user for two beginning letters
            filter_letters = input("Enter the two initial letters to filter by (e.g. ES for Sweden): ").upper()

            if len(filter_letters) != 2 or not filter_letters.isalpha():
                print("Please enter exactly two alphabetic characters.")
                sys.exit(1)

            # The output file is always named callsigns.txt
            output_file = "callsigns.txt"
            
            # Call the processing function
            process_text(input_file, output_file, filter_letters)
            print(f"Processed file saved as {output_file}")
        else:
            print("Please drop a valid .ese file onto the script.")
    else:
        print("No input file provided.")
