branch_name=$(git symbolic-ref -q HEAD)
branch_name=${branch_name##refs/heads/}
branch_name=${branch_name:-HEAD}

echo current branch: "["$branch_name"]"
read -p "messages: " messages
git commit -m "[$branch_name] $messages"
