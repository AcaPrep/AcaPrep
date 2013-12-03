use Rack::Static
run run Proc.new {|env| [200, {"Content-Type" => "text/html"}, File.new('index.html')]}
