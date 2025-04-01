const std = @import("std");

/// This is an attempt at making a thread-safe working producer-consumer queue
/// based on golang channels' api
pub fn Queue(message_type: type) type {
    return struct {
        const Self = @This();

        const prealloc_buffer_size = 512;

        buffer: std.ArrayList(message_type),
        alloc: std.mem.Allocator,

        data_lock: std.Thread.Mutex = .{},
        cond_data_lock: std.Thread.Condition = .{},

        len: usize = 0,
        next_node: u32 = 0,

        pub fn init(alloc: std.mem.Allocator) !Self {
            return Self{
                .alloc = alloc,
                .buffer = try std.ArrayList(message_type).initCapacity(alloc, prealloc_buffer_size),
            };
        }

        pub fn deinit(self: *Self) void {
            self.buffer.deinit();
        }

        pub fn pushMsg(self: *Self, msg: message_type) !void {
            {
                self.data_lock.lock();
                defer self.data_lock.unlock();
                try self.buffer.append(msg);
            }

            self.cond_data_lock.signal();
        }

        pub fn pullMsg(self: *Self) !message_type {
            self.data_lock.lock();
            defer self.data_lock.unlock();

            var items = self.buffer.items[self.next_node..];
            while (items.len == 0) {
                self.cond_data_lock.wait(&self.data_lock);
                items = self.buffer.items[self.next_node..];
            }

            self.next_node += 1;
            return items[0];
        }
    };
}

pub fn push_to_queue(T: type) fn (*Queue(T)) void {
    return (struct {
        pub fn Fn(queue: *Queue(T)) void {
            std.Thread.sleep(5 * std.time.ns_per_s);
            std.debug.print("pushing!\n", .{});
            _ = queue.pushMsg(T{}) catch unreachable;
            std.debug.print("pushed!\n", .{});
        }
    }).Fn;
}

test Queue {
    var dba = std.heap.DebugAllocator(.{
        .thread_safe = true,
        .safety = true,
    }){};

    const msg_type = struct {};

    var Q = try Queue(msg_type).init(dba.allocator());

    _ = try std.Thread.spawn(.{}, push_to_queue(msg_type), .{&Q});

    try Q.pushMsg(.{});
    _ = try Q.pullMsg();
    _ = try Q.pullMsg();
}

