import os
import sys

def push_to_github():
	arg3 = os.environ.get("METRO_GITHUB_TOKEN")
	try:
		os.system('git clone --single-branch --branch dev "https://'+arg3+'@github.com/LACMTA/mybus.git" "mybus"')
		os.chdir('mybus')
		os.system('git remote add mybus-dev "https://'+arg3+'@github.com/LACMTA/mybus-dev.git"')
		os.system('git pull')
		os.system('git push mybus-dev dev -f')
		print('Successfully pushed to mybus-dev')
	except Exception as e:
		print('Error pushing to mybus-dev: ' + str(e))
		sys.exit(1)
	# os.system('git pull')
	# os.system('git add .')
	# os.system('git commit -m "Auto update"')
	# os.system('git push')
	return

if __name__ == "__main__":
	push_to_github()