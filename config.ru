#app = Rack::Builder.app do
#    run Rack::File.new ''

#end

map '/test/' do
    run lambda {|env| [200, {"Content-Type" => "text/html"}, File.new('index.html')]}
end
map '/' do
    use Rack::Static, :index => 'index.html', :urls => ['/']
end

run lambda {|env| [200, {"Content-Type" => "text/html"}, File.new('index.html')]}
